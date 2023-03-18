use axum::{
    body::{boxed, Full},
    extract::{ws::WebSocket, State, WebSocketUpgrade},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use http::{header, Uri};
use regex::Regex;
use reqwest::header::USER_AGENT;
use rust_embed::RustEmbed;
use serde::{Deserialize, Serialize};
use std::{
    env,
    error::Error,
    fmt::Display,
    fs::{create_dir_all, File},
    io::{BufRead, BufReader, Cursor},
    net::SocketAddr,
    path::PathBuf,
    process::{ChildStderr, ChildStdout, Command, Stdio},
    sync::{mpsc, Arc},
    thread,
};
use tokio::sync::broadcast;
use tower_http::cors::CorsLayer;
use tracing::{info, log::debug};

#[cfg(unix)]
use std::os::unix::fs::PermissionsExt;
#[cfg(windows)]
use std::os::windows::fs::PermissionsExt;

#[derive(Clone)]
struct AppState {
    updates_channel: Arc<broadcast::Sender<DownloadUpdate>>,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
enum DownloadStatus {
    Preprocessing,
    Downloading {
        percent: f32,
        speed: String,
        eta: String,
    },
    Postprocessing,
    Complete,
    Error {
        message: String,
    },
}

#[derive(Deserialize, Serialize, Clone, Debug)]
struct DownloadUpdate {
    url: String,
    artist: String,
    title: String,
    status: DownloadStatus,
}
#[derive(Deserialize, Serialize, Debug)]
enum DownloadType {
    Música,
    Mensaje,
}

#[derive(Deserialize, Serialize, Debug)]
struct CutOptions {
    start: Option<String>,
    end: Option<String>,
}

#[derive(Deserialize, Serialize, Debug)]
struct DownloadArgs {
    download_type: DownloadType,
    url: String,
    artist: String,
    title: String,
    cut: Option<CutOptions>,
}

fn parse_status(line: &str) -> Option<DownloadStatus> {
    let download_regex =
        Regex::new(r"\[download\]\s{1,3}(\d{1,3}\.\d)% of .* at (.*) ETA (\d{2}:\d{2})").unwrap();

    if let Some(captures) = download_regex.captures(line) {
        Some(DownloadStatus::Downloading {
            percent: captures[1].parse().unwrap(),
            speed: captures[2].to_string(),
            eta: captures[3].to_string(),
        })
    } else {
        None
    }
}

fn get_download_path(download_type: DownloadType) -> PathBuf {
    match download_type {
        DownloadType::Música => env::var("MUSICA_DOWNLOAD_PATH").unwrap().into(),
        DownloadType::Mensaje => env::var("MENSAJES_DOWNLOAD_PATH").unwrap().into(),
    }
}

fn get_app_dir() -> PathBuf {
    let dir = dirs::data_dir().unwrap().join("youtube-downloader");
    create_dir_all(&dir).ok();
    dir
}

#[derive(Deserialize)]
struct GitHubReleaseAsset {
    name: String,
    browser_download_url: String,
}

#[derive(Deserialize)]
struct GitHubRelease {
    tag_name: String,
    assets: Vec<GitHubReleaseAsset>,
}

async fn get_youtube_dl_latest_release() -> Result<GitHubRelease, Box<dyn Error>> {
    let client = reqwest::Client::new();
    let response = client
        .get("https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest")
        .header(USER_AGENT, "sanfilippopablo/youtube-downloader")
        .send()
        .await?;

    let release = response.json::<GitHubRelease>().await?;
    Ok(release)
    // panic!("hey")
}

fn get_youtube_dl_filename() -> String {
    if env::consts::OS == "windows" {
        "yt-dlp.exe".to_string()
    } else {
        "yt-dlp".to_string()
    }
}

fn get_youtube_dl_location() -> String {
    get_app_dir()
        .join(get_youtube_dl_filename())
        .to_str()
        .unwrap()
        .to_string()
}

async fn download_youtube_dl(release: GitHubRelease) -> Result<(), Box<dyn Error>> {
    let filename = get_youtube_dl_filename();
    let url = release
        .assets
        .iter()
        .find_map(|asset| {
            if asset.name == filename {
                Some(asset.browser_download_url.clone())
            } else {
                None
            }
        })
        .ok_or("Couldn't find the asset for this release")?;

    let response = reqwest::get(url).await?;
    let mut file = File::create(get_youtube_dl_location())?;
    let mut permissions = file.metadata()?.permissions();
    #[cfg(unix)]
    permissions.set_mode(0o755);
    #[cfg(windows)]
    permissions.set_readonly(false);
    file.set_permissions(permissions).ok();
    let mut content = Cursor::new(response.bytes().await?);
    std::io::copy(&mut content, &mut file)?;

    Ok(())
}

async fn update_youtube_dl() -> Result<(), Box<dyn Error>> {
    let app_dir = get_app_dir();
    let youtube_dl_location = app_dir.join(get_youtube_dl_location());
    let release = get_youtube_dl_latest_release().await?;

    if youtube_dl_location.exists() {
        // Check version
        let out = Command::new(youtube_dl_location)
            .arg("--version")
            .output()?;
        let local_version = String::from_utf8(out.stdout)?;
        let local_version = local_version.trim().to_string();
        info!("Existing youtube-dl version: {}", local_version);

        let latest_youtube_dl_version = release.tag_name.clone();
        info!("Latest youtube-dl version: {}", latest_youtube_dl_version);

        if local_version != latest_youtube_dl_version {
            download_youtube_dl(release).await?;
        } else {
            info!("Already at the latest version");
        }
    } else {
        download_youtube_dl(release).await?;
    }

    Ok(())
}

#[derive(Debug)]
enum LogLineOut {
    Stdout,
    Stderr,
}

impl Display for LogLineOut {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            LogLineOut::Stdout => write!(f, "stdout"),
            LogLineOut::Stderr => write!(f, "stderr"),
        }
    }
}

#[derive(Debug)]
struct LogLine {
    out: LogLineOut,
    content: String,
}

fn get_combined_out(stdout: ChildStdout, stderr: ChildStderr) -> mpsc::Receiver<LogLine> {
    let (updates_tx, updates_rx) = mpsc::channel::<LogLine>();
    let updates_tx2 = updates_tx.clone();

    thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            updates_tx
                .send(LogLine {
                    content: line.unwrap(),
                    out: LogLineOut::Stdout,
                })
                .ok();
        }
    });

    thread::spawn(move || {
        let reader = BufReader::new(stderr);
        for line in reader.lines() {
            updates_tx2
                .send(LogLine {
                    content: line.unwrap(),
                    out: LogLineOut::Stderr,
                })
                .ok();
        }
    });

    updates_rx
}

fn download(args: DownloadArgs, tx: broadcast::Sender<DownloadUpdate>) {
    debug!("Executing download");
    thread::spawn(move || {
        let artist = args.artist.clone();
        let artists: Vec<_> = artist.split(";").collect();
        let artist = artists.first().unwrap().to_string();
        let mut postprocessor_args = format!(
            "-metadata title=\"{}\" -metadata artist=\"{}\"",
            args.title, artist
        );

        if let Some(cut) = args.cut {
            if let Some(start) = cut.start {
                postprocessor_args.push_str(format!(" -ss {}", start).as_str());
            }
            if let Some(end) = cut.end {
                postprocessor_args.push_str(format!(" -to {}", end).as_str());
            }
        }
        let postprocessor_args = format!("ffmpeg:{}", postprocessor_args);

        let download_path = get_download_path(args.download_type)
            .join(artist.clone())
            .join(format!("{}.%(ext)s", args.title));

        create_dir_all(&download_path).ok();

        let output_arg = download_path.to_str().unwrap();
        let url = args.url.clone();

        let executable = get_youtube_dl_location();
        let exec_args = [
            "--newline",
            "--verbose",
            "-x",
            "--audio-format",
            "mp3",
            "--postprocessor-args",
            postprocessor_args.as_str(),
            "-o",
            output_arg,
            url.as_str(),
        ];

        info!("Executing {} {}", &executable, &exec_args.join(" "));

        let mut child = Command::new(executable)
            .args(exec_args)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .unwrap();

        let stdout = child.stdout.take().unwrap();
        let stderr = child.stderr.take().unwrap();

        let lines = get_combined_out(stdout, stderr);

        let status = DownloadStatus::Preprocessing;

        tx.send(DownloadUpdate {
            url: url.clone(),
            artist: artist.clone(),
            title: args.title.clone(),
            status,
        })
        .ok();

        for log_line in lines {
            match log_line.out {
                LogLineOut::Stdout => {
                    if let Some(status) = parse_status(&log_line.content) {
                        tx.send(DownloadUpdate {
                            url: url.clone(),
                            artist: artist.clone(),
                            title: args.title.clone(),
                            status,
                        })
                        .ok();
                    }
                }
                _ => {}
            }
        }
        let result = child.wait().unwrap();

        let status = if result.success() {
            DownloadStatus::Complete
        } else {
            DownloadStatus::Error {
                message: "Something happened".to_string(),
            }
        };

        tx.send(DownloadUpdate {
            url: url.clone(),
            artist: artist.clone(),
            title: args.title.clone(),
            status,
        })
        .ok();
    });
}

#[tokio::main]
async fn main() {
    // initialize tracing
    tracing_subscriber::fmt::init();

    if let Err(error) = update_youtube_dl().await {
        dbg!(error);
    };

    let (tx, _) = broadcast::channel(100);

    let app_state = AppState {
        updates_channel: Arc::new(tx),
    };

    // build our application with a route
    let app = Router::new()
        .route("/api/download", post(download_handler))
        .route("/websocket", get(websocket_handler))
        .layer(CorsLayer::permissive())
        .with_state(app_state)
        .fallback(static_handler);

    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    let addr = SocketAddr::from(([127, 0, 0, 1], 3200));
    tracing::info!("listening on {}", addr);
    let _server = axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await;
}

async fn download_handler(
    State(app_state): State<AppState>,
    Json(payload): Json<DownloadArgs>,
) -> StatusCode {
    let tx = app_state.updates_channel.as_ref().clone();
    download(payload, tx);
    StatusCode::OK
}

async fn websocket_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| websocket(socket, state))
}

async fn websocket(mut stream: WebSocket, state: AppState) {
    tokio::spawn(async move {
        let mut updates_receiver = state.updates_channel.subscribe();

        while let Ok(update) = updates_receiver.recv().await {
            stream
                .send(axum::extract::ws::Message::Text(
                    serde_json::to_string(&update).unwrap(),
                ))
                .await
                .ok();
        }
    });
}

#[derive(RustEmbed)]
#[folder = "../client/dist"]
struct Assets;

async fn static_handler(uri: Uri) -> impl IntoResponse {
    let path = uri.path().trim_start_matches('/');

    if path.is_empty() || path == "index.html" {
        return index_html().await;
    };

    match Assets::get(path) {
        Some(content) => {
            let body = boxed(Full::from(content.data));
            let mime = mime_guess::from_path(path).first_or_octet_stream();

            Response::builder()
                .header(header::CONTENT_TYPE, mime.as_ref())
                .body(body)
                .unwrap()
        }
        None => {
            if path.contains('.') {
                return not_found().await;
            }

            index_html().await
        }
    }
}

async fn index_html() -> Response {
    match Assets::get("index.html") {
        Some(content) => {
            let body = boxed(Full::from(content.data));

            Response::builder()
                .header(header::CONTENT_TYPE, "text/html")
                .body(body)
                .unwrap()
        }
        None => not_found().await,
    }
}

async fn not_found() -> Response {
    Response::builder()
        .status(StatusCode::NOT_FOUND)
        .body(boxed(Full::from("404")))
        .unwrap()
}
