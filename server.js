const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {

  socket.on("set user", name => {
    socket.emit("confirm user", name);
  })

  socket.on("send message", (body) => {
    io.emit("distributed message", body);
  });

});

server.listen(8000, () => console.log("server is running on port 8000"));
