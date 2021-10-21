import { Socket } from "node:net";
import { IncomingMessage } from "node:http";
import * as WebSocket from "ws";

export class WebSock {
  wss: WebSocket.Server;
  constructor() {
    this.wss = new WebSocket.Server({ noServer: true });
  }

  listen(): void {
    this.wss.on("connection", (ws) => {
      ws.on("message", (data) => {
        this.wss.clients.forEach((client: WebSocket) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(data);
          }
        });
      });
    });
  }

  handleUpgrade(req: IncomingMessage, socket: Socket, head: Buffer): void {
    this.wss.handleUpgrade(req, socket, head, (ws) => {
      this.wss.emit("connection", ws, req);
    });
  }
}
