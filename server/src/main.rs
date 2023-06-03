use axum::{
    body::{boxed, Full},
    extract::{ws::WebSocket, State, WebSocketUpgrade},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use http::{header, Uri};
use rust_embed::RustEmbed;
use std::{net::SocketAddr, sync::Arc};
use tokio::sync::broadcast;
use tower_http::cors::CorsLayer;
use youtube_downloader::{
    download, playlist::get_playlists, update_youtube_dl, DownloadArgs, DownloadUpdate,
};

#[derive(Clone)]
struct AppState {
    updates_channel: Arc<broadcast::Sender<DownloadUpdate>>,
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
        .route("/api/playlists", get(get_playlists_handler))
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

async fn get_playlists_handler() -> Json<Vec<String>> {
    Json(get_playlists())
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
