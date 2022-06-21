import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { updatePlayerName } from "../interactions/playerSetsName/updatePlayerName"
import { PlayerSetsNameData } from "../types"

export function onPlayerSetsName(data: PlayerSetsNameData, context: ServerClientEventContext) {
  updatePlayerName(data, context)
}
