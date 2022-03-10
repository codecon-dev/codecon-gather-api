import { ServerClientEventContext } from "@gathertown/gather-game-client"
import { trackSteps } from "../interactions/playerMoves/trackSteps"
import { PlayerMovesEventData } from "../types"

export function onPlayerMoves(data: PlayerMovesEventData, context: ServerClientEventContext) {
  trackSteps(data, context)
}

