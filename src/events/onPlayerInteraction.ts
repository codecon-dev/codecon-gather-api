import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { trackInteractions } from "../interactions/playerInteracts/trackInteractions"
import { updateUserStatusWithRandomTitle } from "../interactions/playerInteracts/updateUserStatusWithRandomTitle";
import { PlayerInteractsEventData } from "../types"

const actionsByObjectId: Record<string, Function> = {
  'Balloons3 - r-SrSiX2I6ZgmaKLCLmSu_fd4a8132-1da5-456c-a297-7e785df0ee38': updateUserStatusWithRandomTitle
}

export function onPlayerInteraction(data: PlayerInteractsEventData, context: ServerClientEventContext) {
  const player = context?.player
  const playerName = player?.name
  const interactedObjId = data.playerInteracts.objId
  console.log(`${playerName} interacted with objId: ${interactedObjId}`)

  trackInteractions(data, context)

  const action = actionsByObjectId[interactedObjId]
  if (!action) return

  action(data, context)
}