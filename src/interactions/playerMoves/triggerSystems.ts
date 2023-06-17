import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { PlayerMovesEventData } from "../../types";

export async function triggerSystems(data: PlayerMovesEventData, context: ServerClientEventContext, game: Game) {
  try {
    const mapId = context.player?.map
    if (!mapId) return

    // Currently, no system is triggered by player moves

  } catch (error) {
    console.log(error)
  }
}