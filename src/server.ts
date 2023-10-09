import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  player1 = "";
  player2 = "";
  resetting = false;

  constructor(readonly party: Party.Party) {}

  onClose(connection: Party.Connection<unknown>): void | Promise<void> {
    if (connection.id === this.player1) {
      this.player1 = "";
    }
    if (connection.id === this.player2) {
      this.player2 = "";
    }
    console.log("closed");
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
    );
    // player is already in the game
    if (this.player1 === conn.id || this.player2 === conn.id) {
      return;
    } else if (!this.player1) {
      this.player1 = conn.id;
      conn.send(`${conn.id}: welcome player 1!`);
      return;
    } else if (!this.player2) {
      this.player2 = conn.id;
      conn.send(`${conn.id}: welcome player 2!`);
      return;
    } else {
      conn.send("sorry, game is full");
    }
    console.log({ player1: this.player1, player2: this.player2 });
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    // console.log(`connection ${sender.id} sent message: ${message}`);

    if (message.includes("outOfBounds") && this.resetting === false) {
      this.resetting = true;
      setTimeout(() => {
        this.party.broadcast("resetBall");
        this.resetting = false;
      }, 400);
    }

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
