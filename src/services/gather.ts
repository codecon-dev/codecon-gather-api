import { Game } from "@gathertown/gather-game-client";
import IsomorphicWS from "isomorphic-ws"
import { onPlayerChats } from "../events/onPlayerChats";
import { onPlayerExits } from "../events/onPlayerExits";
import { onPlayerInteraction } from "../events/onPlayerInteraction";
import { onPlayerJoins } from "../events/onPlayerJoins";
import { onPlayerMoves } from "../events/onPlayerMoves";
import { onPlayerSetsEmote } from "../events/onPlayerSetsEmote";
import { onPlayerSetsName } from "../events/onPlayerSetsName";
// import { startUsersUpdateSimulation } from "../services/simulation";
import { getFriendlySpaceId } from "../utils/spaces";

class GatherManager {
  private apiKey: string
  private spaceId: string
  public friendlySpaceId: string
  public game!: Game
  public unsubscribeFromConnection!: () => void

  constructor(spaceId: string) {
    this.apiKey = process.env.GATHER_API_KEY as string
    this.spaceId = spaceId
    this.friendlySpaceId = getFriendlySpaceId(spaceId)
  }

  async connectAndSubscribeToEvents() {
    this.connect()
    await this.subscribeToConnection()
    this.subscribeToEvents()
  }

  getGame() {
    return this.game
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
          console.log(`[${this.friendlySpaceId}] Connection unsuccessful`)
          return reject()
        }

        console.log(`[${this.friendlySpaceId}] Connected!`)
        // startUsersUpdateSimulation()
        return resolve()
      });
    })
  }


  subscribeToEvents() {
    this.game.subscribeToEvent("playerInteracts", (data, context) => onPlayerInteraction(data, context, this.game));
    this.game.subscribeToEvent("playerMoves", (data, context) => onPlayerMoves(data, context, this.game));
    this.game.subscribeToEvent("playerChats", (data, context) => onPlayerChats(data, context, this.game));
    this.game.subscribeToEvent("playerJoins", (data, context) => onPlayerJoins(data, context, this.game));
    this.game.subscribeToEvent("playerExits", (data, context) => onPlayerExits(data, context, this.game));
    this.game.subscribeToEvent("playerSetsEmoteV2", (data, context) => onPlayerSetsEmote(data, context, this.game));
    this.game.subscribeToEvent("playerSetsName", (data, context) => onPlayerSetsName(data, context, this.game));
    console.log(`[${this.friendlySpaceId}] Subscribed to events!`)
  }
}

export default GatherManager