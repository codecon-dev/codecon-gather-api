import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { stands } from "../../data/stands";
import UserManager from "../../services/users";
import { PlayerMovesEventData } from "../../types";
import { getPosition } from "../../utils/movement";
import { getFriendlySpaceId, getSpace, updateUserSpaceStat } from "../../utils/spaces";
import { isInsideArea } from "../../utils/stands";

export async function trackStandVisits(data: PlayerMovesEventData, context: ServerClientEventContext) {
  try {
    const playerId = context?.playerId!
    const friendlySpaceId = getFriendlySpaceId(context?.spaceId)

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    const playerNewPosition = getPosition(data)
    stands.forEach(stand => {
      if (stand.friendlyMapId !== friendlySpaceId) return

      const isInsideStand = isInsideArea(playerNewPosition, stand.topLeftPosition, stand.bottomRightPosition)
      if (!isInsideStand) return

      const spaceStats = getSpace(user, friendlySpaceId)
      const standsVisited = spaceStats.standsVisited
      if (standsVisited?.includes(stand.name)) return

      const updatedSpaceStats = { standsVisited: (standsVisited || []).concat(stand.name)}
      userManager.updateUserInMemory(updateUserSpaceStat(user, friendlySpaceId, updatedSpaceStats))
    })
  } catch (error) {
    console.log(error)
  }
}