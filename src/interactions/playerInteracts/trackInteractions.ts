import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import UserManager from "../../services/users";
import { PlayerInteractsEventData } from "../../types";

export async function trackInteractions(data: PlayerInteractsEventData, context: ServerClientEventContext) {
  try {
    const playerId = context?.playerId!

    const userManager = UserManager.getInstance()
    const user = userManager.getUserInMemory(playerId)
    if (!user) return

    const objectId = data.playerInteracts.objId
    const mapId = context?.player?.map || 'unknown'

    const { objectInteractions } = user
    const alreadyTrackedObjectInteraction = objectInteractions?.find((objInteraction) => {
      return objInteraction.objectId === objectId
    })

    const interactions = user.interactions ? user.interactions + 1 : 1
    if (!alreadyTrackedObjectInteraction) {
      userManager.updateUserInMemory({
        ...user,
        interactions,
        objectInteractions: (objectInteractions || []).concat({
          objectId,
          mapId,
          count: 1
        })
      })
      return
    }

    alreadyTrackedObjectInteraction.count += 1
    userManager.updateUserInMemory({
      ...user,
      interactions,
      objectInteractions
    })

  } catch (error) {
    console.log(error)
  }
}