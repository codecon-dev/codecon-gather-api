import { Game } from "@gathertown/gather-game-client"
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/GameEventContexts"
import { trackMessages } from "../interactions/playerChats/trackMessages"
import { PlayerChatsEventData } from "../types"

export function onPlayerChats(data: PlayerChatsEventData, context: ServerClientEventContext, game: Game) {
  trackMessages(data, context)
}
