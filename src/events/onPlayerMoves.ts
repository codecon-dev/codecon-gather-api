import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { trackStandVisits } from "../interactions/playerMoves/trackStandVisits";
import { trackSteps } from "../interactions/playerMoves/trackSteps"
import { triggerSystems } from "../interactions/playerMoves/triggerSystems";
import { PlayerMovesEventData } from "../types"

export function onPlayerMoves(data: PlayerMovesEventData, context: ServerClientEventContext, game: Game) {
  trackSteps(data, context)
  triggerSystems(data, context, game)
  trackStandVisits(data, context)
}

