import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import UserManager from "../../services/users";
import { PlayerMovesEventData, Position } from "../../types";
import { getMovement } from "../../utils/movement";

export const playerPosition: Record<string, Position> = {}

export async function trackSteps(data: PlayerMovesEventData, context: ServerClientEventContext) {
  try {
    const playerId = context?.playerId!

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    const playerNewPosition = {
      x: data.playerMoves?.x,
      y: data.playerMoves?.y,
      direction: data.playerMoves?.direction,
    }

    const userMovement = getMovement(playerNewPosition, playerPosition, playerId)
    if (userMovement !== 'Same' && userMovement !== 'None') {
      const steps = user.steps ? user.steps + 1 : 1
      userManager.updateUserInMemory({
        ...user,
        steps
      })
    }

    playerPosition[playerId] = playerNewPosition
  } catch (error) {
    console.log(error)
  }
}