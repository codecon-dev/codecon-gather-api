import { ServerClientEventContext } from "@gathertown/gather-game-client"
import { trackInteractions } from "../interactions/playerInteracts/trackInteractions"
import { PlayerInteractsEventData } from "../types"

const actionsByObjectId: Record<string, Function> = {}

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