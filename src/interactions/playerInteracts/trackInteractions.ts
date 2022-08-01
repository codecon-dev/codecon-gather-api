import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import UserManager from "../../services/users";
import { PlayerInteractsEventData } from "../../types";
import { getFriendlySpaceId, getSpace, updateUserSpaceStat } from "../../utils/spaces";

export async function trackInteractions(data: PlayerInteractsEventData, context: ServerClientEventContext) {
  try {
    const playerId = context?.playerId!
    const friendlySpaceId = getFriendlySpaceId(context?.spaceId)

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    const objectId = data.playerInteracts.objId
    const mapId = context?.player?.map || 'unknown'

    const space = getSpace(user, friendlySpaceId)
    const { objectInteractions } = space
    const alreadyTrackedObjectInteraction = objectInteractions?.find((objInteraction) => {
      return objInteraction.objectId === objectId
    })

    const interactions = space.interactions
    if (!alreadyTrackedObjectInteraction) {
      userManager.updateUserInMemory(updateUserSpaceStat(user, friendlySpaceId, {
        interactions: interactions ? interactions + 1 : 1,
        objectInteractions: (objectInteractions || []).concat({
          objectId,
          mapId,
          count: 1
        })
      }))
      return
    }

    alreadyTrackedObjectInteraction.count += 1
    userManager.updateUserInMemory(updateUserSpaceStat(user, friendlySpaceId, {
      interactions: interactions ? interactions + 1 : 1,
      objectInteractions
    }))

  } catch (error) {
    console.log(error)
  }
}