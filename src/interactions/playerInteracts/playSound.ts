import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import { PlayerInteractsEventData } from "../../types";

function getRandomArrayValue(array: any[]) {
  return array[Math.floor(Math.random()*array.length)]
}

const sounds: Record<string, string[]> = {
  ratinho: [
    'https://www.myinstants.com/media/sounds/pare.mp3',
    'https://www.myinstants.com/media/sounds/comedy-male-yelling-yee-ha-sound-effects-free-download-mp3cut.mp3',
    'https://www.myinstants.com/media/sounds/ratinhooo_1.mp3',
    'https://www.myinstants.com/media/sounds/uepa-ratinho-nho-nho_70k.mp3',
    'https://www.myinstants.com/media/sounds/a-bobina-oooooo-bobina1.mp3'
  ],
  faro: [
    'https://www.myinstants.com/media/sounds/y2mate_rLgMJTu.mp3',
    'https://www.myinstants.com/media/sounds/cavaalo0.mp3',
    'https://www.myinstants.com/media/sounds/e-brincadeira-hein-rodrigo-faro.mp3',
    'https://www.myinstants.com/media/sounds/demais-faro-hq_WRnItjN.mp3',
  ],
  alexa: [
    'https://soundspunos.com/uploads/files/2022-01/1641632526_1641200600_alexa_reminder.mp3'
  ],
  fire: [
    'https://soundspunos.com/uploads/files/2018-12/1544510643_fire_zkyuzme_.mp3'
  ]
}

export async function playSound(data: PlayerInteractsEventData, context: ServerClientEventContext, game: Game, category: string) {
  if (!category || !sounds[category]) return

  const src = getRandomArrayValue(sounds[category])
  game.engine.sendAction({
    $case: "playSound",
    playSound: {
      src,
      volume: 1.0,
      targetId: context.playerId
    },
  });  
}