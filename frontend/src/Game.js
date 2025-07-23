import React from "react";

function Game({ czolko, players, playerName }) {
  return (
    <div>
      <h2>Rozgrywka</h2>
      <h3>Twoje “czółko”: <span style={{ fontWeight: "bold", color: "purple" }}>{czolko}</span></h3>
      <div>
        <p>Gracze w pokoju:</p>
        <ul>
          {players.map((p, idx) => <li key={idx}>{p}</li>)}
        </ul>
      </div>
      <div>
        <p>Zadawaj pytania! (na razie mechanika uproszczona)</p>
      </div>
    </div>
  );
}

export default Game;
