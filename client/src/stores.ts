import { writable } from "svelte/store";
import { DownloadInput, DownloadState } from "./types";

const HOST = "localhost:3200";

function createDownloads() {
  const { subscribe, update } = writable<Map<string, DownloadState>>(new Map());

  const ws = new WebSocket(`ws://${HOST}/websocket`);
  ws.addEventListener("open", () => console.log("Opened"));
  ws.addEventListener("message", (message) => {
    console.log(message);
    const data = JSON.parse(message.data) as DownloadState;
    update((downloads) => {
      console.log("Updating downloads");
      downloads.set(data.url, data);
      console.log("Updated");
      console.log({ downloads });
      return downloads;
    });
  });

  return {
    subscribe,
    download: (download: DownloadInput) => {
      console.log({ download });
      fetch(`http://${HOST}/api/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(download),
      });
    },
  };
}

export const downloads = createDownloads();
