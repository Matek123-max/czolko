// backend/server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const rooms = {};
const DEFAULT_WORDS = ['Lewandowski', 'Pizza', 'Myszka Miki', 'Elon Musk', 'Harry Potter', 'Batman', 'Kaczor Donald'];

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
    const shuffled = [...DEFAULT_WORDS].sort(() => Math.random() - 0.5);
    room.words = room.players.map((_, idx) => shuffled[idx % shuffled.length]);
    room.started = true;
    room.players.forEach((p, i) => {
      const czolko = room.words[(i + 1) % room.players.length];
      io.to(p.id).emit('game_started', { word: czolko, players: room.players.map(x=>x.name) });
    });
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

server.listen(4000, () => console.log('Serwer działa na http://localhost:4000'));
