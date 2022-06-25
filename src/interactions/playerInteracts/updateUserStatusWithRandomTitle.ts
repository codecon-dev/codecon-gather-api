import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import axios from "axios";
import GatherManager from "../../services/gather";
import { PlayerInteractsEventData } from "../../types";

function capitalize (str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

async function getRandomTitle() {
  const endpoint = 'https://random-word-form.herokuapp.com/random'
  const { data: noums } = await axios(`${endpoint}/noun`)
  const { data: adjectives } = await axios(`${endpoint}/adjective`)
  return `The ${capitalize(adjectives[0])} ${capitalize(noums[0])}`
}

export async function updateUserStatusWithRandomTitle(data: PlayerInteractsEventData, context: ServerClientEventContext) {
  const { game } = GatherManager.getInstance()
  const title = await getRandomTitle()
  game.engine.sendAction({  
    $case: "setTextStatus",
    setTextStatus: {
      textStatus: title,
      targetId: context.playerId
    }
  })
} 