import React from "react";

function Game({ words, players, myIndex, playerName }) {
  // Dodaj warunek ochronny!
  if (!words || !players || words.length !== players.length || myIndex === null) {
    return <div>Ładowanie gry...</div>;
  }
  return (
    <div>
      <h2>Rozgrywka</h2>
      <ul>
        {players.map((name, idx) => (
          <li key={idx} style={{
            fontWeight: idx === myIndex ? 'bold' : 'normal',
            color: idx === myIndex ? "#a21caf" : "#333"
          }}>
            {idx === myIndex ? (
              <>
                <b>{name} (Ty):</b> <span style={{ color: "#9ca3af" }}>???</span>
              </>
            ) : (
              <>
                {name}: <span style={{ color: "#4f46e5" }}>{words[idx]}</span>
              </>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 24, color: "#7c3aed" }}>
        <b>Spróbuj zgadnąć swoje hasło! <br />Pytaj innych – oni widzą Twój “czółko”!</b>
      </div>
    </div>
  );
}

export default Game;

