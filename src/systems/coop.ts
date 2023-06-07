import { Game } from "@gathertown/gather-game-client";
import { Position } from "../types";
import { hasMatchingCoordinates } from "../utils/movement";
import { getMapObjectById } from "../utils/objects";

type TogglesKeys = 'isPlate1Active' | 'isPlate2Active' | 'isChestActive'

class CoopSystem {
  private static instance: CoopSystem;
  private toggles = {
    isPlate1Active: false,
    isPlate2Active: false,
    isChestActive: false
  }
  // TODO: Check spaceId too
  private mapId = 'UMRC-_nAY2kcoptLFmdTD'
  private plate1Location = { x: 41, y: 20 }
  private plate2Location = { x: 41, y: 24 }
  private chestObjectId = 'TreasureChestClosed - rh35enYGoIjzE5wEfWAFL_2c1f045e-c237-4a56-b83c-60ab1fa5f1c7'
  private blankImage = 'https://cdn.gather.town/v0/b/gather-town-dev.appspot.com/o/objects%2Fblank.png?alt=media&token=6564fd34-433a-4e08-843a-5c4b50d6f9e5';
  private chestImage = 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/internal-dashboard/images/onUu0ikT0JkdF5W8_T3mQ'


  constructor() {
  }

  public static getInstance(): CoopSystem {
    if (!CoopSystem.instance) {
      CoopSystem.instance = new CoopSystem()
    }

    return CoopSystem.instance
  }


  setChestObject(mapId: string, active: boolean, game: Game) {
    const { key } = getMapObjectById(game, this.chestObjectId, mapId)
    game.engine.sendAction({
      $case: "mapSetObjects",
      mapSetObjects: {
        mapId,
        objects: {
          [key as number]: {
            type: active ? 6 : 0,
            previewMessage: 'Press X to challenge the chest',
            highlighted: active ? this.chestImage : this.blankImage,
            normal: active ? this.chestImage : this.blankImage,
            propertiesJson: JSON.stringify({
              message: 'Grr'
            }),
            _tags: []
          }
        }
      },
    });
  }

  activateChestObject(mapId: string, game: Game) {
    if (mapId !== this.mapId) return
    this.toggles.isChestActive = true
    this.setChestObject(mapId, true, game)
    setTimeout(() => {
      this.deactivateChestObject(mapId, game)
    }, 5000)
  }

  deactivateChestObject(mapId: string, game: Game) {
    if (mapId !== this.mapId) return
    this.setChestObject(mapId, false, game)
    this.toggles.isPlate1Active = false
    this.toggles.isPlate2Active = false
    this.toggles.isChestActive = false
  }

  setChestActivation(key: TogglesKeys, active: boolean, mapId: string, game: Game) {
    if (mapId !== this.mapId) return
    this.toggles[key] = active

    if (this.toggles.isPlate1Active && this.toggles.isPlate2Active && !this.toggles.isChestActive) {
      console.log(`[COOP SYSTEM] Activating chest`)
      this.activateChestObject(mapId, game)
      return
    }

    if (!this.toggles.isChestActive) {
      setTimeout(() => {
        console.log(`[COOP SYSTEM] Deactivating chest`)
        this.toggles[key] = false
      }, 5000)
      return
    }
  }

  triggerChest(playerNewPosition: Position, mapId: string, game: Game) {
    if (mapId !== this.mapId) return
    if (hasMatchingCoordinates(playerNewPosition, this.plate1Location)) {
      console.log(`[COOP SYSTEM] Plate 1 activated`)
      this.setChestActivation('isPlate1Active', true, mapId, game)
    }

    if (hasMatchingCoordinates(playerNewPosition, this.plate2Location)) {
      console.log(`[COOP SYSTEM] Plate 2 activated`)
      this.setChestActivation('isPlate2Active', true, mapId, game)
    }
  }
}

export default CoopSystem