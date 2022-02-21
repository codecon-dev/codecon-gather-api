import UserManager from "../../services/users";
import { PlayerChatsEventData } from "../../types";

export async function trackMessages(data: PlayerChatsEventData) {
  try {
    const playerId = data.playerChats.senderId

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    const messages = user.messages ? user.messages + 1 : 1
    userManager.updateUserInMemory({
      ...user,
      messages
    })

  } catch (error) {
    console.log(error)
  }
}