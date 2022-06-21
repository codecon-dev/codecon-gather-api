import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import UserManager from "../../services/users";
import { PlayerExitsEventData } from "../../types";

export async function trackExit(data: PlayerExitsEventData, context: ServerClientEventContext) {
  try {
    const playerId = context.playerId!

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    userManager.setUserAsOfflineInMemory(user)
  } catch (error) {
    console.log(error)
  }
}