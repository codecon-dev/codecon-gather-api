import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { triggerClaps } from "../interactions/playerSetsEmote/triggerClaps"
import { PlayerSetsEmoteEventData } from "../types"

export function onPlayerSetsEmote(data: PlayerSetsEmoteEventData, context: ServerClientEventContext, game: Game) {
  triggerClaps(data, context, game)
}
