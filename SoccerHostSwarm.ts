import { IncomingMessage } from "node:http";
import { Socket } from "node:net";
import { WebSock } from "./WebSocket";

interface Lobby {
  id: number;
  hostId: number;
  serverName: string;
  websocket: WebSock;
}

export class SocketHostSwarm {
  private servers: Lobby[] = [];

  constructor() {}

  createServer(serverName: string, hostId: number): number {
    const id = this.servers.length;
    const newLobby: Lobby = {
      id,
      hostId,
      serverName,
      websocket: new WebSock(),
    };

    this.servers.push(newLobby);
    this.servers[id].websocket.listen();

    return id;
  }

  handleUpgrade(
    id: number,
    req: IncomingMessage,
    socket: Socket,
    head: Buffer
  ): void {
    this.servers[id].websocket.handleUpgrade(req, socket, head);
  }
}
