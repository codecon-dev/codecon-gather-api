import { Game } from "@gathertown/gather-game-client";
import { Position } from "../types";
import { hasMatchingCoordinates } from "../utils/movement";
import { getMapObjectById } from "../utils/objects";

type TogglesKeys = 'isPlate1Active' | 'isPlate2Active' | 'isBossActive'

class BossSystem {
  private static instance: BossSystem;
  private toggles = {
    isPlate1Active: false,
    isPlate2Active: false,
    isBossActive: false
  }
  // TODO: Check spaceId too
  private plate1Location = { x: 18, y: 3 }
  private plate2Location = { x: 21, y: 3 }
  private bossObjectId = 'BarrelLitMetal - Nc5jVuh8lyMUbpZlCZVTa_05ccfa05-eac0-4b60-b0b9-924ad5076f3d'
  private blankImage = 'https://cdn.gather.town/v0/b/gather-town-dev.appspot.com/o/objects%2Fblank.png?alt=media&token=6564fd34-433a-4e08-843a-5c4b50d6f9e5';
  private bossImage = 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/internal-dashboard/images/hZSWr066RzaCkkv8uIR-l'


  constructor() {
  }

  public static getInstance(): BossSystem {
    if (!BossSystem.instance) {
      BossSystem.instance = new BossSystem()
    }

    return BossSystem.instance
  }


  setBossObject(mapId: string, active: boolean, game: Game) {
    const { key } = getMapObjectById(game, this.bossObjectId, mapId)
    game.engine.sendAction({
      $case: "mapSetObjects",
      mapSetObjects: {
        mapId,
        objects: {
          [key as number]: {
            type: active ? 6 : 0,
            previewMessage: 'Press X to challenge the boss',
            highlighted: active ? this.bossImage : this.blankImage,
            normal: active ? this.bossImage : this.blankImage,
            propertiesJson: JSON.stringify({
              message: 'Grr'
            }),
            _tags: []
          }
        }
      },
    });
  }

  activateBossObject(mapId: string, game: Game) {
    this.toggles.isBossActive = true
    this.setBossObject(mapId, true, game)
    setTimeout(() => {
      this.deactivateBossObject(mapId, game)
    }, 5000)
  }

  deactivateBossObject(mapId: string, game: Game) {
    this.setBossObject(mapId, false, game)
    this.toggles.isPlate1Active = false
    this.toggles.isPlate2Active = false
    this.toggles.isBossActive = false
  }

  setBossActivation(key: TogglesKeys, active: boolean, mapId: string, game: Game) {
    this.toggles[key] = active

    if (this.toggles.isPlate1Active && this.toggles.isPlate2Active && !this.toggles.isBossActive) {
      this.activateBossObject(mapId, game)
      return
    }

    if (!this.toggles.isBossActive) {
      setTimeout(() => this.toggles[key] = false, 1000)
      return
    }
  }

  triggerBoss(playerNewPosition: Position, mapId: string, game: Game) {
    if (hasMatchingCoordinates(playerNewPosition, this.plate1Location)) {
      this.setBossActivation('isPlate1Active', true, mapId, game)
    }

    if (hasMatchingCoordinates(playerNewPosition, this.plate2Location)) {
      this.setBossActivation('isPlate2Active', true, mapId, game)
    }
  }
}

export default BossSystem