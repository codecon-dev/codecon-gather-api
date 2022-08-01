import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import UserManager from "../../services/users";
import { PlayerExitsEventData } from "../../types";
import { getFriendlySpaceId } from "../../utils/spaces";

export async function trackExit(data: PlayerExitsEventData, context: ServerClientEventContext) {
  try {
    const playerId = context.playerId!
    const friendlySpaceId = getFriendlySpaceId(context?.spaceId)

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    userManager.setUserAsOfflineInMemory(user, friendlySpaceId)
  } catch (error) {
    console.log(error)
  }
}