const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const words = [
  "javascript",
  "computer",
  "multiplayer",
  "keyboard",
  "internet"
];

let players = [];
let currentWord = "";
let scores = {};

io.on("connection", (socket) => {

  if (players.length >= 2) {
    socket.emit("roomFull");
    return;
  }

  players.push(socket.id);
  scores[socket.id] = 0;

  io.emit("playerCount", players.length);

  if (players.length === 2) {
    startGame();
  }

  socket.on("guessWord", (guess) => {
    if (guess.toLowerCase() === currentWord) {
      scores[socket.id]++;

      io.emit("winner", {
        player: socket.id,
        score: scores[socket.id]
      });

      startGame();
    }
  });

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    players = players.filter(id => id !== socket.id);
    delete scores[socket.id];
    io.emit("playerCount", players.length);
  });
});

function startGame() {
  currentWord = words[Math.floor(Math.random() * words.length)];

  const scrambled = currentWord
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  io.emit("newWord", scrambled);
}

server.listen(3000, () => {
  console.log("Server running on port 3000");
});