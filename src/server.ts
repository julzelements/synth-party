import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  player1 = "";
  player2 = "";
  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // console.log(JSON.stringify(Array.from(this.party.getConnections())));
    const roomSize = Array.from(this.party.getConnections()).length;
    if (roomSize === 1) {
      this.player1 = conn.id;
      conn.send(`${conn.id}: welcome player 1!`);
    }
    if (roomSize === 2) {
      this.player2 = conn.id;
      conn.send(`${conn.id}: welcome player 2!`);
    }
    if (roomSize > 2) {
      conn.send("sorry, game is full");
    }
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);

    if (message.includes("playerMove")) {
      const move = JSON.parse(message).playerMove;
      const opponentMove = move;
      this.party.broadcast(JSON.stringify({ opponentMove }), [sender.id]);
    }
    // as well as broadcast it to all the other connections in the room...
    this.party.broadcast(
      message,
      // ...except for the connection it came from
      [sender.id]
    );
  }
}

Server satisfies Party.Worker;
