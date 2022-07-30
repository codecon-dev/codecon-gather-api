import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/GameEventContexts";
import UserManager from "../../services/users";
import { PlayerChatsEventData } from "../../types";
import { getFriendlySpaceId, getSpace, updateUserSpaceStat } from "../../utils/spaces";

export async function trackMessages(data: PlayerChatsEventData, context: ServerClientEventContext) {
  try {
    const playerId = data.playerChats.senderId
    const friendlySpaceId = getFriendlySpaceId(context?.spaceId)

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    const space = getSpace(user, friendlySpaceId)
    const messages = space.messages
    const updatedSpaceStats = { messages: messages ? messages + 1 : 1 }
    userManager.updateUserInMemory(updateUserSpaceStat(user, friendlySpaceId, updatedSpaceStats))

  } catch (error) {
    console.log(error)
  }
}