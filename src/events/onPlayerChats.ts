import { Game } from "@gathertown/gather-game-client"
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/GameEventContexts"
import { trackMessages } from "../interactions/playerChats/trackMessages"
import { PlayerChatsEventData } from "../types"
import { triggerChatbot } from "../interactions/playerChats/triggerChatbot";

export function onPlayerChats(data: PlayerChatsEventData, context: ServerClientEventContext, game: Game) {
  trackMessages(data, context)
  triggerChatbot(data, context, game)
}
