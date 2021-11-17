import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import { download } from "./download";
import path from "path";

const PORT = process.env.PORT ?? 3001;

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "../../client/dist")));

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log(message);
    const data = JSON.parse(message.toString());
    console.log({ data });
    const downloadProcess = download(data);

    downloadProcess.on("data", (data) => {
      console.log({ data });
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(data));
      });
    });
  });
});

server.listen(PORT, () => console.log(`Listening at ${PORT}`));
