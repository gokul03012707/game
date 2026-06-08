const socket = io();

socket.on("roomFull", () => {
  alert("Room is full (2 players only)");
});

socket.on("playerCount", (count) => {
  document.getElementById(
    "status"
  ).innerText = `Players: ${count}/2`;
});

socket.on("newWord", (word) => {
  document.getElementById(
    "scrambledWord"
  ).innerText = word;
});

socket.on("winner", (data) => {
  alert(
    `Player won! Score: ${data.score}`
  );
});

function submitGuess() {
  const guess =
    document.getElementById("guessInput").value;

  socket.emit("guessWord", guess);

  document.getElementById("guessInput").value = "";
}

function sendMessage() {
  const input =
    document.getElementById("chatInput");

  socket.emit("chatMessage", input.value);

  input.value = "";
}

socket.on("chatMessage", (msg) => {
  const messages =
    document.getElementById("messages");

  messages.innerHTML += `<div>${msg}</div>`;
});