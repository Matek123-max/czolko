import React, { useState } from "react";
import Lobby from "./Lobby";
import Game from "./Game";
import './App.css';

function App() {
  const [screen, setScreen] = useState("lobby");
  const [czolkoWords, setCzolkoWords] = useState([]);
  const [myIndex, setMyIndex] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");

  return (
    <div className="main-card">
      <h1>Czółko Online</h1>
      {screen === "lobby" && (
        <Lobby
          setScreen={setScreen}
          setCzolkoWords={setCzolkoWords}
          setPlayers={setPlayers}
          setMyIndex={setMyIndex}
          setPlayerName={setPlayerName}
          playerName={playerName}
        />
      )}
      {screen === "game" && (
        <Game
          words={czolkoWords}
          players={players}
          myIndex={myIndex}
          playerName={playerName}
        />
      )}
    </div>
  );
}

export default App;

