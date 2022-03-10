import { ServerClientEventContext } from "@gathertown/gather-game-client"
import { trackJoin } from "../interactions/playerJoins/trackJoin"
import { registerUser } from "../interactions/playerJoins/registerUser"
import { PlayerJoinsEventData } from "../types"

export function onPlayerJoins(data: PlayerJoinsEventData, context: ServerClientEventContext) {
  registerUser(data, context)
  trackJoin(data, context)
}
