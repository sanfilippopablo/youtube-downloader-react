import EventEmitter from "events";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const DOWNLOAD_PATH = process.env.DOWNLOAD_PATH ?? "/tmp";

type DownloadArgs = {
  url: string;
  artist: string;
  title: string;
  cut?: {
    start?: string;
    end?: string;
  };
};
export function download({ url, artist, title, cut }: DownloadArgs): EventEmitter {
  console.log("Downloading");
  const downloadPath = path.join(DOWNLOAD_PATH, artist, `${title}.%(ext)s`);
  fs.mkdirSync(path.dirname(downloadPath), { recursive: true });
  const downloadRegex = /\[download\]\s{1,3}(\d{1,3}\.\d)% of .* at (.*) ETA (\d{2}:\d{2})/;
  const eventEmitter = new EventEmitter();
  let error = false;

  let postprocessorArgs = `-metadata title="${title}" -metadata artist="${artist}"`;

  if (cut?.start) {
    postprocessorArgs += ` -ss ${cut?.start}`;
  }

  if (cut?.end) {
    postprocessorArgs += ` -to ${cut?.end}`;
  }

  let cmd = `youtube-dl -x --audio-format mp3 --postprocessor-args '${postprocessorArgs}' -o '${downloadPath}' ${url}`;
  const proc = spawn(cmd, { shell: true });
  proc.stdout.on("data", function (data: Buffer) {
    error = false;
    const response = data.toString().trim();

    if (response.startsWith("[youtube]")) {
      // Preprocessing
      const data = {
        url,
        artist,
        title,
        status: "preprocessing",
        details: {
          percent: 0,
          description: "Preparando descarga",
        },
      };
      eventEmitter.emit("data", data);
    } else if (downloadRegex.test(response)) {
      // Downloading
      const info = downloadRegex.exec(response)!;
      const data = {
        url,
        artist,
        title,
        status: "downloading",
        details: {
          description: "Descargando video",
          percent: Number(info[1]),
          speed: info[2],
          ETA: info[3],
        },
      };
      eventEmitter.emit("data", data);
    } else if (response.startsWith("[ffmpeg]")) {
      //Postprocessing
      const data = {
        url,
        artist,
        title,
        status: "postprocessing",
        details: {
          percent: 100,
          description: "Convirtiendo a MP3",
        },
      };
      eventEmitter.emit("data", data);
    }
  });

  proc.on("close", () => {
    if (!error) {
      const data = {
        url,
        artist,
        title,
        status: "complete",
        details: {
          percent: 100,
          description: "Listo",
        },
      };
      eventEmitter.emit("data", data);
    }
  });

  proc.stderr.on("data", (stderr: Buffer) => {
    // Error
    error = true;
    console.log(stderr.toString());
    const data = {
      url,
      artist,
      title,
      status: "error",
      details: {
        percent: 100,
        description: "Error",
      },
    };
    eventEmitter.emit("data", data);
  });

  return eventEmitter;
}
