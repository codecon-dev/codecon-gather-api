import { ServerClientEventContext } from "@gathertown/gather-game-client";
import { createOrUpdateUser, getUser } from "../../services/database";
import { PlayerMovesEventData } from "../../types";

export async function registerUser(data: PlayerMovesEventData, context: ServerClientEventContext) {
  try {
    const playerId = context.playerId
    if (!playerId) return

    const user = await getUser(playerId)
    if (user) return

    const playerName = context.player!.name!

    console.log(`New user registered: ${playerName} (${playerId})!`)
    await createOrUpdateUser({
      gatherPlayerId: playerId,
      gatherName: playerName
    })
  } catch (error) {
    console.log(error)
  }
}