import { trackMessages } from "../interactions/playerChats/trackMessages"
import { PlayerChatsEventData } from "../types"

export function onPlayerChats(data: PlayerChatsEventData) {
  trackMessages(data)
}
