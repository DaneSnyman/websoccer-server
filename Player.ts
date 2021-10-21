export interface Player {
  id: number;
  username: string;
}
export class PlayerSwarm {
  private Players: Player[] = [];

  isPlayer(usernameOrId: string | number): number {
    let playerId: number;
    this.Players.forEach((player) => {
      if (typeof usernameOrId === "number") {
        playerId = player.id === usernameOrId ? player.id : -1;
      } else {
        playerId =
          player.username.toLowerCase() === usernameOrId.toLowerCase()
            ? player.id
            : -1;
      }
    });
    return playerId;
  }

  createPlayer(username: string): number {
    let id = this.isPlayer(username);
    if (id < 0) {
      id = this.Players.length;
      this.Players.push({ id, username });
    }
    return id;
  }
}
