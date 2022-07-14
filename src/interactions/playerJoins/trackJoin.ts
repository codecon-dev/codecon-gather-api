import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import UserManager from "../../services/users";
import { PlayerJoinsEventData } from "../../types";
import { getFriendlySpaceId, updateUserSpaceStat } from "../../utils/spaces";

export async function trackJoin(data: PlayerJoinsEventData, context: ServerClientEventContext) {
  try {
    const playerId = context.playerId!
    const friendlySpaceId = getFriendlySpaceId(context?.spaceId)

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    const updatedSpaceStats = {
      isOnline: true,
      lastJoined: Date.now()
    }
    userManager.updateUserInMemory(updateUserSpaceStat(user, friendlySpaceId, updatedSpaceStats))
  } catch (error) {
    console.log(error)
  }
}