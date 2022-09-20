import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { bugCollections } from "../data/bugs";
import { playSound } from "../interactions/playerInteracts/playSound";
import { trackInteractions } from "../interactions/playerInteracts/trackInteractions"
import { updateUserStatusWithRandomTitle } from "../interactions/playerInteracts/updateUserStatusWithRandomTitle";
import BugsSystem from "../systems/bugs";
import { PlayerInteractsEventData } from "../types"
import { getAllBugsObjIds } from "../utils/bugs";
// import { logObjectInteraction } from "../utils/debug";

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
  const interactedObjId = data.playerInteracts.objId
  // logObjectInteraction(data, context)

  trackInteractions(data, context)

  const bugObjIds = getAllBugsObjIds(bugCollections)
  if (bugObjIds.includes(interactedObjId)) {
    const bugSystemInstance = BugsSystem.getInstance()
    bugSystemInstance.triggerBug(interactedObjId)
    return
  }

  const action = actionsByObjectId[interactedObjId]
  if (!action) return

  action(data, context, game)
}