import { ServerClientEventContext } from "@gathertown/gather-game-client";
import { getUser } from "../../services/database";
import UserManager from "../../services/users";
import { PlayerJoinsEventData } from "../../types";

export async function registerUser(data: PlayerJoinsEventData, context: ServerClientEventContext) {
  try {
    console.log(context)
    const playerId = context.playerId
    if (!playerId) return

    const user = await getUser(playerId)
    if (user) return

    const playerName = context.player!.name!

    const userManager = UserManager.getInstance()
    userManager.createUserInMemory({
      gatherPlayerId: playerId,
      gatherName: playerName
    })
    console.log(`New user registered: ${playerName} (${playerId})!`)
  } catch (error) {
    console.log(error)
  }
}