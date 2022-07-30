import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { trackJoin } from "../interactions/playerJoins/trackJoin"
import { registerUser } from "../interactions/playerJoins/registerUser"
import { PlayerJoinsEventData } from "../types"
import { Game } from "@gathertown/gather-game-client";

export function onPlayerJoins(data: PlayerJoinsEventData, context: ServerClientEventContext, game: Game) {
  registerUser(data, context)
  trackJoin(data, context)
}
