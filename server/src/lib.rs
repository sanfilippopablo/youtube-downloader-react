pub mod playlist;

use std::{
    env,
    error::Error,
    fmt::Display,
    fs::{create_dir_all, File},
    io::{BufRead, BufReader, Cursor},
    path::PathBuf,
    process::{ChildStderr, ChildStdout, Command, Stdio},
    sync::mpsc,
    thread,
};

use http::header::USER_AGENT;
use regex::Regex;
use serde::{Deserialize, Serialize};
use tokio::sync::broadcast;
use tracing::{debug, info};

#[cfg(unix)]
use std::os::unix::fs::PermissionsExt;

use crate::playlist::add_file_to_playlist;

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
pub struct DownloadUpdate {
    url: String,
    artist: String,
    title: String,
    status: DownloadStatus,
}
#[derive(Deserialize, Serialize, Debug)]
pub enum DownloadType {
    Música,
    Mensaje,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CutOptions {
    start: Option<String>,
    end: Option<String>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct DownloadArgs {
    pub download_type: DownloadType,
    pub url: String,
    pub artist: String,
    pub title: String,
    pub cut: Option<CutOptions>,
    pub add_to_playlists: Vec<String>,
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

fn get_download_path_from_env(env_name: &str) -> PathBuf {
    env::var(env_name)
        .map(|val| PathBuf::from(val))
        .unwrap_or_else(|_| {
            let download_path = dirs::home_dir().unwrap();
            tracing::info!(
                "No {} provided. Using {:?} instead",
                env_name,
                download_path
            );
            download_path
        })
        .into()
}
pub fn get_download_path(download_type: DownloadType) -> PathBuf {
    match download_type {
        DownloadType::Música => get_download_path_from_env("MUSICA_DOWNLOAD_PATH"),
        DownloadType::Mensaje => get_download_path_from_env("MENSAJES_DOWNLOAD_PATH"),
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
    permissions.set_readonly(false);
    #[cfg(unix)]
    permissions.set_mode(0o755);
    file.set_permissions(permissions).ok();
    let mut content = Cursor::new(response.bytes().await?);
    std::io::copy(&mut content, &mut file)?;

    Ok(())
}

pub async fn update_youtube_dl() -> Result<(), Box<dyn Error>> {
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

pub fn download(args: DownloadArgs, tx: broadcast::Sender<DownloadUpdate>) {
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
            "--encoding",
            "utf-8",
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

        for playlist in args.add_to_playlists {
            add_file_to_playlist(
                download_path
                    .to_str()
                    .unwrap()
                    .to_string()
                    .replace(".%(ext)s", ".mp3")
                    .into(),
                playlist,
            )
        }
    });
}
