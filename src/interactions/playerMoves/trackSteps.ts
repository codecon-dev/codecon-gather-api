import { ServerClientEventContext } from "@gathertown/gather-game-client";
import { increaseSteps } from "../../services/database";
import { PlayerMovesEventData, Position } from "../../types";
import { getMovement } from "../../utils/movement";

export const playerPosition: Record<string, Position> = {}

export async function trackSteps(data: PlayerMovesEventData, context: ServerClientEventContext) {
  try {
    const playerId = context?.playerId!
    const playerNewPosition = {
      x: data.playerMoves?.x,
      y: data.playerMoves?.y,
      direction: data.playerMoves?.direction,
    }

    const userMovement = getMovement(playerNewPosition, playerPosition, playerId)
    if (userMovement !== 'Same' && userMovement !== 'None') {
      await increaseSteps(playerId)
    }

    playerPosition[playerId] = playerNewPosition
  } catch (error) {
    console.log(error)
  }
}