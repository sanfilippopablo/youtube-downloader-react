import { writable } from "svelte/store";
import { DownloadInput, DownloadState } from "./types";

const PORT = import.meta.env.PROD ? 3000 : 3001;

function createDownloads() {
  const { subscribe, update } = writable<Map<string, DownloadState>>(new Map());

  const ws = new WebSocket(`ws://localhost:${PORT}`);
  ws.addEventListener("open", () => console.log("Opened"));
  ws.addEventListener("message", (message) => {
    console.log(message);
    const data = JSON.parse(message.data) as DownloadState;
    update((downloads) => {
      downloads.set(data.url, data);
      return downloads;
    });
  });

  return {
    subscribe,
    download: (download: DownloadInput) => ws.send(JSON.stringify(download)),
  };
}

export const downloads = createDownloads();
