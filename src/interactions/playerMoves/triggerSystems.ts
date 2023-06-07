import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import CoopSystem from "../../systems/coop";
import { PlayerMovesEventData } from "../../types";
import { getPosition } from "../../utils/movement";

export async function triggerSystems(data: PlayerMovesEventData, context: ServerClientEventContext, game: Game) {
  try {
    const mapId = context.player?.map
    if (!mapId) return
    const playerNewPosition = getPosition(data)

    const coopSystem = CoopSystem.getInstance()
    coopSystem.triggerChest(playerNewPosition, mapId, game)

  } catch (error) {
    console.log(error)
  }
}