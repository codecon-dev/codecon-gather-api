import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import UserManager from "../../services/users";
import { PlayerMovesEventData, Position, User } from "../../types";
import { getMovement, getPosition } from "../../utils/movement";
import { getFriendlySpaceId, getSpace, updateUserSpaceStat } from "../../utils/spaces";

export type PlayerPositionMap = Record<string, Position>
export const playerPositionMap: PlayerPositionMap = {}
export const playerPositionMapPerSpace: Record<string, PlayerPositionMap> = {}

export async function trackSteps(data: PlayerMovesEventData, context: ServerClientEventContext) {
  try {
    const playerId = context?.playerId!
    const friendlySpaceId = getFriendlySpaceId(context?.spaceId)

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    const playerNewPosition = getPosition(data)
    const previousPlayerSpacePosition = playerPositionMapPerSpace[friendlySpaceId] || {}
    const previousPlayerPosition = previousPlayerSpacePosition[playerId]
    const userMovement = getMovement(playerNewPosition, previousPlayerPosition)
    if (userMovement !== 'Same' && userMovement !== 'None') {
      const spaceStats = getSpace(user, friendlySpaceId)
      const steps = spaceStats.steps
      const updatedSpaceStats = { steps: steps ? steps + 1 : 1 }
      userManager.updateUserInMemory(updateUserSpaceStat(user, friendlySpaceId, updatedSpaceStats))
    }

    playerPositionMapPerSpace[friendlySpaceId] = {
      ...playerPositionMapPerSpace[friendlySpaceId],
      [playerId]: playerNewPosition
    }
  } catch (error) {
    console.log(error)
  }
}