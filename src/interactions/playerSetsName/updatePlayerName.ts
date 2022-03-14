import { ServerClientEventContext } from "@gathertown/gather-game-client";
import UserManager from "../../services/users";
import { PlayerSetsNameData } from "../../types";

export async function updatePlayerName(data: PlayerSetsNameData, context: ServerClientEventContext) {
  try {
    const playerId = context.playerId
    if (!playerId) return

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    const playerName = data.playerSetsName.name
    userManager.updateUserInMemory({
      ...user,
      gatherName: playerName,
    })
  } catch (error) {
    console.log(error)
  }
}