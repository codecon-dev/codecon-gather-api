import { ServerClientEventContext } from "@gathertown/gather-game-client"
import { trackExit } from "../interactions/playerExits/trackExit"
import { PlayerExitsEventData } from "../types"

export function onPlayerExits(data: PlayerExitsEventData, context: ServerClientEventContext) {
  trackExit(data, context)
}
