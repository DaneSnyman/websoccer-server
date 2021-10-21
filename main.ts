import express = require("express");
import { PlayerSwarm } from "./Player";
import { Server } from "./Server";
import { SocketHostSwarm } from "./SoccerHostSwarm";

const soccerSwarm = new SocketHostSwarm();
const playerSwarm = new PlayerSwarm();
const port = 9382;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res): void => {
  res.send("Hello World!");
});

app.post("/soccer/create-player", (req, res) => {
  let username = req.body.username;
  if (username) {
    const id = playerSwarm.createPlayer(req.body.username);
    res.status(200).send({ id, username });
  }
});

app.post("/soccer/create-server", (req, res) => {
  const serverName = req.body.serverName;
  const playerId = playerSwarm.isPlayer(req.body.playerId);
  if (req.body.name && playerId >= 0) {
    const serverID = soccerSwarm.createServer(serverName, playerId);
    res.status(200).send({ serverID });
  }
});

const webSockServe = new Server(app, port);
webSockServe.upgrade(soccerSwarm);
