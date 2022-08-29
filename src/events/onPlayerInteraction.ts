import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { playSound } from "../interactions/playerInteracts/playSound";
import { trackInteractions } from "../interactions/playerInteracts/trackInteractions"
import { updateUserStatusWithRandomTitle } from "../interactions/playerInteracts/updateUserStatusWithRandomTitle";
import { PlayerInteractsEventData } from "../types"

function playSoundWithCategory(category: string) {
  return (data: PlayerInteractsEventData, context: ServerClientEventContext, game: Game) => {
    return playSound(data, context, game, category)
  }
}

const actionsByObjectId: Record<string, Function> = {
  'Balloons3 - r-SrSiX2I6ZgmaKLCLmSu_fd4a8132-1da5-456c-a297-7e785df0ee38': updateUserStatusWithRandomTitle,
  'Blank - QBiYhmko0be5JCAk5QsH_cea893db-ae23-4062-8a40-f57a33d4d7cd': playSoundWithCategory('ratinho'),
  'Blank - QBiYhmko0be5JCAk5QsH_e7df7c9f-2abf-4ece-a84d-89655dd0a176': playSoundWithCategory('faro'),
}

export function onPlayerInteraction(data: PlayerInteractsEventData, context: ServerClientEventContext, game: Game) {
  const player = context?.player
  const playerName = player?.name
  const interactedObjId = data.playerInteracts.objId
  console.log(`${playerName} interacted with objId: ${interactedObjId}`)

  trackInteractions(data, context)

  const action = actionsByObjectId[interactedObjId]
  if (!action) return

  action(data, context, game)
}