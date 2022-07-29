import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { getUser } from "../../services/database";
import UserManager from "../../services/users";
import { PlayerJoinsEventData } from "../../types";
import { getFriendlySpaceId, updateUserSpaceStat } from "../../utils/spaces";

export async function registerUser(data: PlayerJoinsEventData, context: ServerClientEventContext) {
  try {
    const friendlySpaceId = getFriendlySpaceId(context?.spaceId)
    const playerId = context.playerId
    if (!playerId) return

    const user = await getUser(playerId)
    if (user) return

    const playerName = context.player!.name! || String(context.playerId)

    const userManager = UserManager.getInstance()

    const newUser = {
      gatherPlayerId: playerId,
      gatherName: playerName,
      spacesByDate: {}
    }

    const spaceStats = {
      isOnline: true,
      lastJoined: Date.now()
    }

    const newUserWithSpaceStat = updateUserSpaceStat(newUser, friendlySpaceId, spaceStats)
    userManager.createUserInMemory(newUserWithSpaceStat)
    console.log(`New user registered: ${playerName} (${playerId})!`)
  } catch (error) {
    console.log(error)
  }
}