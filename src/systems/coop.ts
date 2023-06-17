import { Game, Player } from "@gathertown/gather-game-client";
import { hasMatchingCoordinates } from "../utils/movement";
import { getMapObjectById } from "../utils/objects";
import { gatherManagers } from "..";

class CoopSystem {
  private static instance: CoopSystem;
  private toggles = {
    isPlate1Active: false,
    isPlate2Active: false,
    isChestActive: false
  }
  private spaceId = 'cfTnBsETAY2ODiMS/Codecon 2023 - Atividades'
  private mapId = 'UMRC-_nAY2kcoptLFmdTD'
  private plate1Location = { x: 41, y: 20 }
  private plate2Location = { x: 41, y: 24 }
  private chestObjectId = 't9nG37IYkfxSiSGD4WJv_b85237ce-3e52-4afb-a7a6-2ca80c57126b'
  private blankImage = 'https://cdn.gather.town/v0/b/gather-town-dev.appspot.com/o/objects%2Fblank.png?alt=media&token=6564fd34-433a-4e08-843a-5c4b50d6f9e5';
  private chestImage = 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/cfTnBsETAY2ODiMS/bZN0DISPr1shn5bPnzDJbB'


  constructor() {
    console.log(`[COOP SYSTEM] Starting coop system`)
    const gatherManager = gatherManagers[this.spaceId]
    if (!gatherManager) return

    const game = gatherManager.getGame()
    setInterval(() => {
      const players = Object.values(game.players)
      const playerOnPlate1 = players.find((player: Player) => {
        return hasMatchingCoordinates(player, this.plate1Location)
      })
      const playerOnPlate2 = players.find((player: Player) => {
        return hasMatchingCoordinates(player, this.plate2Location)
      })
      if (playerOnPlate1 && playerOnPlate2 && !this.toggles.isChestActive) {
        console.log(`[COOP SYSTEM] All players are on the plates`)
        this.activateChestObject(this.mapId, game)
        return
      }

      if ((!playerOnPlate1 || !playerOnPlate2) && this.toggles.isChestActive) {
        console.log(`[COOP SYSTEM] At least one of the plates is now empty`)
        this.deactivateChestObject(this.mapId, game)
        return
      }
    }, 500)
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
            type: active ? 1 : 0,
            previewMessage: 'Abrir [x]',
            highlighted: active ? this.chestImage : this.blankImage,
            normal: active ? this.chestImage : this.blankImage,
            propertiesJson: JSON.stringify({
              url: process.env.COOP_CHEST_URL,
            }),
            distThreshold: 1,
            _tags: []
          }
        }
      },
    });
  }

  activateChestObject(mapId: string, game: Game) {
    this.toggles.isChestActive = true
    this.setChestObject(mapId, true, game)
  }

  deactivateChestObject(mapId: string, game: Game) {
    this.setChestObject(mapId, false, game)
    this.toggles.isChestActive = false
  }
}

export default CoopSystem