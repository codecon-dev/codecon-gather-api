import { ServerClientEventContext } from "@gathertown/gather-game-client"
import { triggerClaps } from "../interactions/playerSetsEmote/triggerClaps"
import { PlayerSetsEmoteEventData } from "../types"

export function onPlayerSetsEmote(data: PlayerSetsEmoteEventData, context: ServerClientEventContext) {
  triggerClaps(data, context)
}