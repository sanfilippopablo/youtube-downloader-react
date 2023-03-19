use std::{env, path::PathBuf};

use tokio::sync::broadcast::{self};
use youtube_downloader::{download, update_youtube_dl, DownloadArgs, DownloadType};

#[tokio::test]
async fn test_download() {
    update_youtube_dl().await.ok();
    let (tx, mut rx) = broadcast::channel(10);

    download(
        DownloadArgs {
            download_type: DownloadType::Música,
            url: String::from("https://www.youtube.com/watch?v=1qZHVQiRUJA"),
            artist: String::from("Marcos Vidal"),
            title: String::from("Tu Cara"),
            cut: None,
        },
        tx,
    );

    let mut updates = Vec::new();

    while let Ok(update) = rx.recv().await {
        updates.push(update);
    }

    dbg!(updates);

    let download_dir: PathBuf = env::var("MUSICA_DOWNLOAD_PATH").unwrap().into();
    let expected_download_path = download_dir.join("Marcos Vidal").join("Tu Cara.mp3");
    dbg!(&expected_download_path);
    assert!(expected_download_path.exists());
}
