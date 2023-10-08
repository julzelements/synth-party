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

addEventListener("leftmove", (event) => {
  // ts-ignore
  console.log(event.detail);
  const leftMove: Message = event.detail;
  conn.send(leftMove);
});

addEventListener("rightmove", (event) => {
  // ts-ignore
  console.log(event.detail);
  const rightMove: Message = event.detail;
  conn.send(rightMove);
});

// You can even start sending messages before the connection is open!
conn.addEventListener("message", (event) => {
  const rightMoveEvent = new CustomEvent("rightMove", { detail: event.data });
  dispatchEvent(rightMoveEvent);
});

// Let's listen for when the connection opens
// And send a ping every 2 seconds right after
conn.addEventListener("open", () => {
  console.log("connected");
  // add("Sending a ping every 2 seconds...");
  // // TODO: make this more interesting / nice
  // clearInterval(pingInterval);
  // pingInterval = setInterval(() => {
  //   conn.send("ping");
  // }, 1000);
});
