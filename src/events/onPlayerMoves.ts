import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { trackSteps } from "../interactions/playerMoves/trackSteps"
import { PlayerMovesEventData } from "../types"

export function onPlayerMoves(data: PlayerMovesEventData, context: ServerClientEventContext) {
  trackSteps(data, context)
}

