import { Game } from '@gathertown/gather-game-client';
import { ServerClientEventContext } from '@gathertown/gather-game-client/dist/src/GameEventContexts';
import { PlayerInteractsEventData, WiredObjectListPerKey } from '../types';

export function getMapObjectById(game: Game, objId: string, mapId: string) {
  if (!game.partialMaps[mapId]) return {}
  for (const _key in game.partialMaps[mapId].objects) {
    const key = parseInt(_key);
    const obj = game.partialMaps[mapId]?.objects?.[key];
    if (obj?.id === objId) return { obj, key }
  }
  return {}
}

export function changeSoundSrcForObjectKeys(game: Game, objectKeys: number[], mapId: string, src: string) {
  const objects: WiredObjectListPerKey = objectKeys.reduce((allObjects: WiredObjectListPerKey, key) => {
    allObjects[key] = {
      sound: {
        src,
        volume: 2,
        loop: false,
        maxDistance: 10
      },
      _tags: []
    }
    return allObjects
  }, {})

  game.engine.sendAction({
    $case: "mapSetObjects",
    mapSetObjects: {
      mapId,
      objects
    }
  })
}
/**
 * The object won't open any note or window, but still will receive interactions.
 * Funcion meant to be used as one-time only.
 */
export function setObjectAsExtension(data: PlayerInteractsEventData, context: ServerClientEventContext, game: Game) {
  const mapId = context?.player?.map as string
  const interactedObjId = data.playerInteracts.objId
  const { key } = getMapObjectById(game, interactedObjId, mapId)
  game.engine.sendAction({
    $case: "mapSetObjects",
    mapSetObjects: {
      mapId,
      objects: {
        [key as number]: {
          type: 5,         
          _tags: []
        }
      }
    },
  });
}