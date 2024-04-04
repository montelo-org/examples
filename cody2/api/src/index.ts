import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new Server(server);

//an event listener is set up for new WebSocket connections and passes a socket object that represents the connection.
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    console.log(`Received message: ${data}`);
    //The received message is broadcasted to all connected clients using the emit() method of the io object.
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(8000, () => {
  console.log("Server listening on port 8000");
});
