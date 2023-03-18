export type DownloadState = {
  url: string;
  artist: string;
  title: string;
  status:
    | "Preprocessing"
    | { Downloading: { percent: number; speed: string; ETA: string } }
    | "Complete"
    | { Error: string };
};

export type CutParameters = {
  start?: string;
  end?: string;
};

export type DownloadType = "Música" | "Mensaje";

export type DownloadInput = {
  download_type: DownloadType;
  url: string;
  artist: string;
  title: string;
  cut?: CutParameters;
};
