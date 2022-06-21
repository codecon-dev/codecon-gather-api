import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import UserManager from "../../services/users";
import { PlayerJoinsEventData } from "../../types";

export async function trackJoin(data: PlayerJoinsEventData, context: ServerClientEventContext) {
  try {
    const playerId = context.playerId!

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    userManager.updateUserInMemory({
      ...user,
      isOnline: true,
      lastJoined: Date.now()
    })
  } catch (error) {
    console.log(error)
  }
}