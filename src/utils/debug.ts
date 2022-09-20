import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/GameEventContexts";
import { PlayerInteractsEventData, User } from "../types";
import { getTodayDate } from "./spaces";

export function logSpaceStatsOnUserMovement(user: User, friendlySpaceId: string) {
  console.log(user.spacesByDate[getTodayDate()][friendlySpaceId])
}

export function logObjectInteraction(data: PlayerInteractsEventData, context: ServerClientEventContext) {
  const player = context?.player
  const playerName = player?.name
  const interactedObjId = data.playerInteracts.objId
  console.log(`${playerName} interacted with object:\n${JSON.stringify({
    objId: interactedObjId,
    spaceId: context.spaceId.replace('\\', '/'),
    mapId: context.player?.map,
  }, null, 2)}`)
}