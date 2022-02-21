import { ServerClientEventContext } from "@gathertown/gather-game-client"
import { trackJoin } from "../interactions/playerJoins/trackJoin"
import { PlayerJoinsEventData } from "../types"

export function onPlayerJoins(data: PlayerJoinsEventData, context: ServerClientEventContext) {
  trackJoin(data, context)
}
