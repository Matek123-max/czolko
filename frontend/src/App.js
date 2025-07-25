import './App.css';
import React, { useState } from "react";
import Lobby from "./Lobby";
import Game from "./Game";

function App() {
  const [screen, setScreen] = useState("lobby");
  const [czolko, setCzolko] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");

  return (
    <div style={{ padding: 24 }}>
      <h1>Czółko Online</h1>
      {screen === "lobby" && (
        <Lobby
          setScreen={setScreen}
          setCzolko={setCzolko}
          setPlayers={setPlayers}
          setPlayerName={setPlayerName}
          playerName={playerName}
        />
      )}
      {screen === "game" && (
        <Game czolko={czolko} players={players} playerName={playerName} />
      )}
    </div>
  );
}

export default App;
