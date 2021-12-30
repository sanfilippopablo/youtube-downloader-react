export type DownloadState = {
  url: string;
  artist: string;
  title: string;
  status: "preprocessing" | "downloading" | "postprocessing" | "complete" | "error";
  details: {
    description: string;
    percent: number;
    speed: string;
    ETA: string;
  };
};

export type CutParameters = {
  start?: string;
  end?: string;
};

export type DownloadInput = {
  url: string;
  artist: string;
  title: string;
  cut?: CutParameters;
};
