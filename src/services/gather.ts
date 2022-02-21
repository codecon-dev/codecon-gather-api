import { Game } from "@gathertown/gather-game-client";
import IsomorphicWS from "isomorphic-ws"
import { onPlayerChats } from "../events/onPlayerChats";
import { onPlayerExits } from "../events/onPlayerExits";
import { onPlayerInteraction } from "../events/onPlayerInteraction";
import { onPlayerJoins } from "../events/onPlayerJoins";
import { onPlayerMoves } from "../events/onPlayerMoves";
import { startUsersUpdateSimulation } from "../services/simulation";

class GatherManager {
  private apiKey: string
  private mapId: string
  private spaceId: string
  private game!: Game
  public unsubscribeFromConnection!: () => void

  constructor(apiKey: string, mapId: string, spaceId: string) {
    this.apiKey = apiKey
    this.mapId = mapId
    this.spaceId = spaceId
  }

  connect() {
    // @ts-expect-error
    global.WebSocket = IsomorphicWS;
    const game = new Game(this.spaceId, () => Promise.resolve({ apiKey: this.apiKey }));
    this.game = game
    game.connect();
  }

  async subscribeToConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.unsubscribeFromConnection = this.game.subscribeToConnection((connected) => {
        if (!connected) {
          console.log('Connection unsuccessful')
          return reject()
        }

        console.log('Connected!')
        // startUsersUpdateSimulation()
        return resolve()
      });
    })

  }

  subscribeToEvents() {
    this.game.subscribeToEvent("playerInteracts", onPlayerInteraction);
    this.game.subscribeToEvent("playerMoves", onPlayerMoves);
    this.game.subscribeToEvent("playerChats", onPlayerChats);
    this.game.subscribeToEvent("playerJoins", onPlayerJoins);
    this.game.subscribeToEvent("playerExits", onPlayerExits);
  }
}

export default GatherManager