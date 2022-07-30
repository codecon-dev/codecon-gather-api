import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import axios from "axios";
import { PlayerInteractsEventData } from "../../types";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

async function getRandomTitle() {
  const endpoint = 'https://random-word-form.herokuapp.com/random'
  const { data: noums } = await axios(`${endpoint}/noun`)
  const { data: adjectives } = await axios(`${endpoint}/adjective`)
  return `The ${capitalize(adjectives[0])} ${capitalize(noums[0])}`
}

export async function updateUserStatusWithRandomTitle(data: PlayerInteractsEventData, context: ServerClientEventContext, game: Game) {
  const title = await getRandomTitle()
  game.engine.sendAction({
    $case: "setTextStatus",
    setTextStatus: {
      textStatus: title,
      targetId: context.playerId
    }
  })
} 