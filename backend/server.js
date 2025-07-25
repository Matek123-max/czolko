// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json()); // by obsłużyć POST/JSON

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Ładujemy słowa z pliku
const wordsFile = path.join(__dirname, 'words.json');
function loadWords() {
  return JSON.parse(fs.readFileSync(wordsFile, 'utf8'));
}
function saveWords(words) {
  fs.writeFileSync(wordsFile, JSON.stringify(words, null, 2), 'utf8');
}
let DEFAULT_WORDS = loadWords();

const rooms = {};

io.on('connection', (socket) => {
  socket.on('create_room', ({ roomId, name }, cb) => {
    if (rooms[roomId]) return cb({ error: "Pokój już istnieje" });
    rooms[roomId] = { players: [{ id: socket.id, name }], started: false, words: [] };
    socket.join(roomId);
    cb({ ok: true });
    io.to(roomId).emit('players_update', rooms[roomId].players);
  });

  socket.on('join_room', ({ roomId, name }, cb) => {
    if (!rooms[roomId]) return cb({ error: "Nie ma takiego pokoju" });
    if (rooms[roomId].started) return cb({ error: "Gra już trwa" });
    rooms[roomId].players.push({ id: socket.id, name });
    socket.join(roomId);
    cb({ ok: true });
    io.to(roomId).emit('players_update', rooms[roomId].players);
  });

  socket.on('start_game', ({ roomId }) => {
  const room = rooms[roomId];
  if (!room) return;
  const N = room.players.length;
  // Wylosuj N unikalnych słów:
  let allWords = [...DEFAULT_WORDS].sort(() => Math.random() - 0.5);
  if (allWords.length < N) return; // za mało słów!
  const words = allWords.slice(0, N);

  // Każdemu graczowi wyślij listę z "???" na swoim miejscu:
  room.players.forEach((p, i) => {
    const playerWords = words.map((w, idx) => idx === i ? "???" : w);
    io.to(p.id).emit('game_started', {
      myIndex: i,
      players: room.players.map(x => x.name),
      words: playerWords,
    });
  });
  room.started = true;
  room.words = words;
  io.to(roomId).emit('players_update', room.players);
});


  socket.on('disconnect', () => {
    for (let roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
      if (rooms[roomId].players.length === 0) delete rooms[roomId];
      else io.to(roomId).emit('players_update', rooms[roomId].players);
    }
  });
});

// === API do zarządzania słowami ===

// Pobieranie wszystkich słów
app.get('/words', (req, res) => {
  res.json(loadWords());
});

// Dodawanie nowego słowa
app.post('/words', (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== "string" || !word.trim()) {
    return res.status(400).json({ error: "Nieprawidłowe słowo" });
  }
  const words = loadWords();
  if (words.includes(word.trim())) {
    return res.status(400).json({ error: "To słowo już istnieje!" });
  }
  words.push(word.trim());
  saveWords(words);
  DEFAULT_WORDS = words;
  res.json({ ok: true, word: word.trim() });
});

server.listen(4000, () => console.log('Serwer działa na http://localhost:4000'));
