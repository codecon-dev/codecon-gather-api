import { Game } from '@gathertown/gather-game-client';
import { WiredObjectListPerKey } from '../types';

export function getMapObjectById(game: Game, objId: string, mapId: string) {
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