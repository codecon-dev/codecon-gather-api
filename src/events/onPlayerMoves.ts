import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { trackSteps } from "../interactions/playerMoves/trackSteps"
import { triggerSystems } from "../interactions/playerMoves/triggerSystems";
import { PlayerMovesEventData } from "../types"

export function onPlayerMoves(data: PlayerMovesEventData, context: ServerClientEventContext) {
  trackSteps(data, context)
  triggerSystems(data, context)
}

