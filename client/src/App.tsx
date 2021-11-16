import { useEffect, useRef, useState } from "react";

function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3001");
    ws.current.addEventListener("open", () => console.log("Connected"));

    return () => ws.current!.close();
  }, []);
  return ws.current;
}

function MoreIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-600 h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  );
}

function useInput() {
  const [value, setValue] = useState("");
  return {
    value,
    onChange: (e: any) => setValue(e.target.value),
  };
}

function DownloadCard({ download }: { download: DownloadState }) {
  const color =
    download.status === "error" ? "red" : download.status === "complete" ? "green" : "blue";
  return (
    <div className={`border border-${color}-500 rounded p-2 bg-white`}>
      <div className="flex items-center">
        <div className="flex-1">
          <span className="font-medium">{download.title} </span>
          <span className="text-sm text-gray-600">{download.artist}</span>
        </div>
        <div className="rounded-full w-min p-2 transition cursor-pointer hover:bg-gray-300">
          <MoreIcon />
        </div>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div className={`text-xs font-semibold inline-block uppercase text-${color}-600`}>
            {download.details.description}
          </div>
          <div className={`text-right text-xs font-semibold inline-block text-${color}-600`}>
            {download.details.percent}%
          </div>
        </div>
        <div className={`overflow-hidden h-2 mb-4 text-xs flex rounded bg-${color}-200`}>
          <div
            style={{ width: `${download.details.percent}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${color}-500 rounded-full`}
          ></div>
        </div>
      </div>
    </div>
  );
}

type DownloadState = {
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

function App() {
  const url = useInput();
  const artist = useInput();
  const title = useInput();
  const [downloads, setDownloads] = useState<Map<string, DownloadState>>(new Map());

  const ws = useWebSocket();

  useEffect(() => {
    if (ws) {
      ws!.addEventListener("message", (message: any) => {
        const data = JSON.parse(message.data) as DownloadState;
        setDownloads((downloads) => new Map(downloads.set(data.url, data)));
      });
    }
  }, [ws]);

  function download() {
    ws!.send(
      JSON.stringify({
        url: url.value,
        artist: artist.value,
        title: title.value,
      })
    );
  }

  return (
    <div className="h-screen flex">
      <div className="flex-1 p-8 gap-16 flex flex-col">
        <div className="flex items-center justify-center">
          <button
            className=" border border-blue-500 hover:bg-blue-500 text-white bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-l outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            Música
          </button>
          <button
            className="text-blue-500 bg-transparent border-t border-b border-r border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-r outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            Mensaje
          </button>
        </div>
        <div className="gap-4 flex flex-col">
          <input
            type="text"
            placeholder="URL"
            className="px-3 py-4 placeholder-gray-400 text-gray-600 relative bg-white rounded text-base border border-gray-400 outline-none focus:outline-none focus:ring w-full"
            {...url}
          />
          <input
            type="text"
            placeholder="Artista"
            className="px-3 py-4 placeholder-gray-400 text-gray-600 relative bg-white rounded text-base border border-gray-400 outline-none focus:outline-none focus:ring w-full"
            {...artist}
          />
          <input
            type="text"
            placeholder="Título"
            className="px-3 py-4 placeholder-gray-400 text-gray-600 relative bg-white rounded text-base border border-gray-400 outline-none focus:outline-none focus:ring w-full"
            {...title}
          />
        </div>
        <div>
          <h2 className="border-b font-medium text-lg mb-4">Cortar</h2>
          <div className="flex gap-4 items-center text-l justify-center">
            <input
              type="text"
              placeholder="Desde"
              className="px-2 py-2 text-sm placeholder-gray-400 text-gray-600 relative bg-white rounded border border-gray-400 outline-none focus:outline-none focus:ring w-24"
            />
            <input
              type="text"
              placeholder="Hasta"
              className="px-2 py-2 text-sm placeholder-gray-400 text-gray-600 relative bg-white rounded border border-gray-400 outline-none focus:outline-none focus:ring w-24"
            />
          </div>
        </div>
        <div>
          <h2 className="border-b font-medium text-lg mb-4">Opciones</h2>
          <div className="flex gap-2 items-center text-l">
            <input type="checkbox" id="addToNew" name="subscribe" value="newsletter" />
            <label htmlFor="addToNew">
              Agregar a lista de reproducción <em>Lo nuevo</em>
            </label>
          </div>
        </div>
        <button
          className="bg-blue-500 text-white active:bg-purple-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={download}
        >
          Descargar
        </button>
      </div>
      <div className="flex flex-col flex-1 gap-2 p-8 bg-gray-100 overflow-scroll border-l">
        {[...downloads.values()].map((download) => (
          <DownloadCard key={download.url} download={download} />
        ))}
      </div>
    </div>
  );
}

export default App;
