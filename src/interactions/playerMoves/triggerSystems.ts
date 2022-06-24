import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import BossSystem from "../../systems/boss";
import { PlayerMovesEventData } from "../../types";
import { getPosition } from "../../utils/movement";


export async function triggerSystems(data: PlayerMovesEventData, context: ServerClientEventContext) {
  try {
    const mapId = context.player?.map
    if (!mapId) return
    const playerNewPosition = getPosition(data)

    const bossSystem = BossSystem.getInstance()
    bossSystem.triggerBoss(playerNewPosition, mapId)

  } catch (error) {
    console.log(error)
  }
}