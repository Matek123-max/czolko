import React from "react";

function Game({ czolko, players, playerName }) {
  return (
  <div>
    <h2>Rozgrywka</h2>
    <h3>
      Twoje “czółko”:
      <span style={{ fontWeight: "bold", color: "#a21caf", marginLeft: 6 }}>
        {czolko}
      </span>
    </h3>
    <div style={{ margin: "24px 0" }}>
      <p>Gracze w pokoju:</p>
      <ul>
        {players.map((p, idx) => <li key={idx}>{p}</li>)}
      </ul>
    </div>
    <div>
      <p style={{ color: "#7c3aed" }}>
        Zadawaj pytania i baw się dobrze! (kolejne ulepszenia w następnej wersji)
      </p>
    </div>
  </div>
);

}

export default Game;
