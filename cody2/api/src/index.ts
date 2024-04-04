import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handleMessage } from "./handleMessage";

const app = express();
app.use(cors());

app.get("/health", (req, res) => {
  res.send("OK").status(200);
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("message", (data) => handleMessage({ socket, data }));
});

server.listen(8000, () => {
  console.log("Server listening on port 8000");
});
