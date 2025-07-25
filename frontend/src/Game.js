import React from "react";

function Game({ words, players, myIndex, playerName }) {
  return (
    <div>
      <h2>Twoje “czółko”</h2>
      <ul>
        {players.map((name, idx) => (
          <li key={idx} style={{
            fontWeight: idx === myIndex ? 'bold' : 'normal',
            color: idx === myIndex ? "#a21caf" : "#333"
          }}>
            {idx === myIndex ? (
              <>
                <b>{name} (Ty):</b> <span style={{color:"#9ca3af"}}>???</span>
              </>
            ) : (
              <>
                {name}: <span style={{color:"#4f46e5"}}>{words[idx]}</span>
              </>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 24, color: "#7c3aed" }}>
        <b>Spróbuj zgadnąć swoje hasło! <br/>Pytaj innych – oni widzą Twój “czółko”!</b>
      </div>
    </div>
  );
}

export default Game;


}
{screen === "game" && (
  <Game
    words={czolkoWords}
    players={players}
    myIndex={myIndex}
    playerName={playerName}
  />
)}


