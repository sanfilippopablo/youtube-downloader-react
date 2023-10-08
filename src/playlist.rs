use std::{env, fs, path::PathBuf};

pub fn get_playlists() -> Vec<String> {
    let playlists_path = env::var("PLAYLISTS_PATH").unwrap();
    fs::read_dir(playlists_path)
        .unwrap()
        .filter_map(|entry| {
            let file_name = PathBuf::from(
                entry
                    .unwrap()
                    .file_name()
                    .to_str()
                    .to_owned()
                    .unwrap()
                    .to_string(),
            );
            if let Some(os_str) = file_name.extension() {
                if os_str.to_str().unwrap() == "m3u8" {
                    Some(file_name.to_str().unwrap().to_string())
                } else {
                    None
                }
            } else {
                None
            }
        })
        .collect()
}

pub fn add_file_to_playlist(path: PathBuf, playlist_name: String) {
    let playlists_path = env::var("PLAYLISTS_PATH").unwrap();
    let playlist_path = PathBuf::from(playlists_path).join(playlist_name);
    let mut playlist: Vec<_> = m3u::Reader::open(playlist_path.clone())
        .unwrap()
        .entries()
        .map(|entry| entry.unwrap())
        .collect();
    playlist.push(m3u::path_entry(path));
    let file = std::fs::File::create(playlist_path).unwrap();
    let mut writer = m3u::Writer::new(file);
    for entry in playlist {
        writer.write_entry(&entry).ok();
    }
}

#[test]
fn test_get_playlists() {
    env::set_var(
        "PLAYLISTS_PATH",
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("test_data/playlists"),
    );
    assert_eq!(get_playlists(), vec![String::from("playlist")])
}
