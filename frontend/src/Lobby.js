import React, { useEffect, useState } from "react";
import socket from "./socket";

function Lobby({
  setScreen,
  setCzolkoWords,
  setPlayers,
  setMyIndex,
  setPlayerName,
  playerName
}) {
  const [roomInput, setRoomInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [playersList, setPlayersList] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on("players_update", (players) => setPlayersList(players));
    socket.on("game_started", ({ words, myIndex, players }) => {
      console.log("ODEBRANO GAME_STARTED:", words, myIndex, players);
      setCzolkoWords(words);
      setPlayers(players);
      setMyIndex(myIndex);
      setScreen("game");
    });
    return () => {
      socket.off("players_update");
      socket.off("game_started");
    };
  }, [setScreen, setCzolkoWords, setPlayers, setMyIndex]);

  function createRoom() {
    if (!nameInput || !roomInput) return setError("Podaj nazwę i pokój");
    socket.emit("create_room", { roomId: roomInput, name: nameInput }, (res) => {
      if (res.error) setError(res.error);
      else {
        setRoomId(roomInput);
        setPlayerName(nameInput);
      }
    });
  }

  function joinRoom() {
    if (!nameInput || !roomInput) return setError("Podaj nazwę i pokój");
    socket.emit("join_room", { roomId: roomInput, name: nameInput }, (res) => {
      if (res.error) setError(res.error);
      else {
        setRoomId(roomInput);
        setPlayerName(nameInput);
      }
    });
  }

  function startGame() {
    const id = roomId || roomInput;
    if (!id) return;
    socket.emit("start_game", { roomId: id });
  }

  return (
    <div>
      <h2>Dołącz lub utwórz pokój</h2>
      <input placeholder="Twój nick" value={nameInput} onChange={e => setNameInput(e.target.value)} />
      <input placeholder="Kod pokoju" value={roomInput} onChange={e => setRoomInput(e.target.value)} />
      <div>
        <button onClick={createRoom} style={{ marginRight: 8 }}>Utwórz pokój</button>
        <button onClick={joinRoom}>Dołącz do pokoju</button>
      </div>
      {error && <div style={{ color: "#e11d48", margin: 8 }}>{error}</div>}
      <hr style={{ margin: "24px 0" }} />
      <h3>Gracze w pokoju:</h3>
      <ul>
        {playersList.map(p => <li key={p.id || p.name}>{p.name}</li>)}
      </ul>
      {playersList.length > 1 && (
        <button onClick={startGame} style={{ marginTop: 16, fontWeight: 600 }}>Start gry</button>
      )}
    </div>
  );
}

export default Lobby;

