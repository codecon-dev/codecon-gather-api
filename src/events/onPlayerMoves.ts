import { ServerClientEventContext } from "@gathertown/gather-game-client"
import { registerUser } from "../interactions/playerMoves/registerUser"
import { trackSteps } from "../interactions/playerMoves/trackSteps"
import { PlayerMovesEventData } from "../types"

export function onPlayerMoves(data: PlayerMovesEventData, context: ServerClientEventContext) {
  registerUser(data, context)
  trackSteps(data, context)
}

