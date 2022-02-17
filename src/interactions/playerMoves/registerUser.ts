import { ServerClientEventContext } from "@gathertown/gather-game-client";
import { createOrUpdateUser, getUser } from "../../services/database";
import { PlayerMovesEvent } from "../../types";

export async function registerUser(data: PlayerMovesEvent, context: ServerClientEventContext) {
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