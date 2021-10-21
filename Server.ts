import { Application } from "express";
import { Http2Server } from "node:http2";
import { WebSock } from "./WebSocket";
import { SocketHostSwarm } from "./SoccerHostSwarm";

export class Server {
  server: Http2Server;
  wssChat: WebSock;
  wssDraw: WebSock;
  wssSoccer: WebSock;

  constructor(app: Application, port: number) {
    this.server = app.listen(port, (): void => {
      console.log(`Server listening at ${port}`);
    });

    this.wssChat = new WebSock();
    this.wssDraw = new WebSock();
    this.wssSoccer = new WebSock();

    this.wssChat.listen();
    this.wssDraw.listen();
    this.wssSoccer.listen();
  }

  upgrade(soccerSwarm: SocketHostSwarm): void {
    this.server.on("upgrade", (req, socket, head): void => {
      const pathname = req.url;

      switch (pathname) {
        case "/chat":
          this.wssChat.handleUpgrade(req, socket, head);
          break;

        case "/draw":
          this.wssDraw.handleUpgrade(req, socket, head);
          break;

        case "/soccer":
          this.wssSoccer.handleUpgrade(req, socket, head);
          break;

        default:
          if (pathname.includes("/soccer/")) {
            const id = pathname.slice(pathname.lastIndexOf("/") + 1);
            soccerSwarm.handleUpgrade(id, req, socket, head);
          } else {
            socket.destroy();
          }
          break;
      }
    });
  }
}
