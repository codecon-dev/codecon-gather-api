import { ServerClientEventContext } from "@gathertown/gather-game-client";
import GatherManager from "../../services/gather";
import { PlayerSetsEmoteEventData } from "../../types";
import { debounce } from "../../utils/debounce";
import { changeSoundSrcForObjectKeys, getMapObjectById } from "../../utils/objects";

const NUMBER_OF_EMOTES_REQUIRED = 4
const COOLDOWN_TIME_IN_SECONDS = 10
const RESET_EMOTES_TIME_IN_SECONDS = 10
const CLAPS_SOUND_URL = 'https://assets.mixkit.co/sfx/download/mixkit-conference-audience-clapping-strongly-476.wav'
const EMPTY_URL = 'https://clear.plz'
const OBJECT_ID_TO_PLAY_CLAPS = 'Bulletin (Note) - BgaTeaDUwpoAobpTSTwOU_70959c6e-5d49-482f-b07d-74ffb2fd03ec'

type Claps = {
  users: string[],
  count: number
}
const claps: Claps = {
  users: [],
  count: 0
}
const mapClaps: Record<string, Claps> = {}
let isOnCooldown = false

function resetMapIdClaps(mapId: string) {
  mapClaps[mapId].count = 0
  mapClaps[mapId].users = []

}

const debouncedResetClaps = debounce(resetMapIdClaps, RESET_EMOTES_TIME_IN_SECONDS * 1000)

export async function triggerClaps(data: PlayerSetsEmoteEventData, context: ServerClientEventContext) {
  try {
    if (isOnCooldown) return
    if (!data.playerSetsEmoteV2.emote) return

    const mapId = context.player?.map
    if (!mapId) return

    const playerId = context.playerId!
    if (!mapClaps[mapId]) {
      mapClaps[mapId] = {
        users: [playerId],
        count: 1
      }
    } else {
      const hasClapped = mapClaps[mapId].users.some(user => user === playerId)
      if (hasClapped) return
      mapClaps[mapId] = {
        users: mapClaps[mapId].users.concat([playerId]),
        count: mapClaps[mapId].count + 1
      }
    }

    if (mapClaps[mapId].count <= NUMBER_OF_EMOTES_REQUIRED) {
      debouncedResetClaps(mapId)
      return
    }

    debouncedResetClaps.cancel()
    const { game } = GatherManager.getInstance()
    const { key } = getMapObjectById(game, OBJECT_ID_TO_PLAY_CLAPS, mapId)
    changeSoundSrcForObjectKeys(game, [key!], mapId, CLAPS_SOUND_URL)
    resetMapIdClaps(mapId)
    isOnCooldown = true

    setTimeout(() => {
      isOnCooldown = false
      changeSoundSrcForObjectKeys(game, [key!], mapId, EMPTY_URL)
    }, COOLDOWN_TIME_IN_SECONDS * 1000)
  } catch (error) {
    console.log(error)
  }
}

