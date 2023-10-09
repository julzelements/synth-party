import type { Message } from "partysocket/ws";
import "./styles.css";

import PartySocket from "partysocket";

declare const PARTYKIT_HOST: string;

// Let's append all the messages we get into this DOM element
const output = document.getElementById("app") as HTMLDivElement;

// A PartySocket is like a WebSocket, except it's a bit more magical.
// It handles reconnection logic, buffering messages while it's offline, and more.
const conn = new PartySocket({
  host: PARTYKIT_HOST,
  room: "my-new-room",
});

addEventListener(`playerMove`, (event) => {
  // ts-ignore
  console.log("💊");
  const playerMove: Message = event.detail;
  conn.send(JSON.stringify({ playerMove }));
});

addEventListener("outOfBounds", (event) => {
  console.log("💥");
  conn.send("outOfBounds");
});

// You can even start sending messages before the connection is open!
conn.addEventListener("message", (event) => {
  if (event.data.includes("player 1")) {
    console.log("🍄");
    dispatchEvent(new CustomEvent("newPlayer", { detail: 1 }));
  }
  if (event.data.includes("player 2")) {
    console.log("🍄");
    dispatchEvent(new CustomEvent("newPlayer", { detail: 2 }));
  }
  if (event.data.includes("opponentMove")) {
    console.log("🥷🏻");
    dispatchEvent(new CustomEvent("opponentMove", { detail: event }));
  }
  if (event.data.includes("resetBall")) {
    dispatchEvent(new Event("resetBall"));
  }
});

// Let's listen for when the connection opens
// And send a ping every 2 seconds right after
conn.addEventListener("open", () => {
  console.log("connected");
  console.log(conn.id);
  // add("Sending a ping every 2 seconds...");
  // // TODO: make this more interesting / nice
  // clearInterval(pingInterval);
  // pingInterval = setInterval(() => {
  //   conn.send("ping");
  // }, 1000);
});
