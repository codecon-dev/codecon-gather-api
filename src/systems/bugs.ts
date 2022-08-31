import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/GameEventContexts";
import { gatherManagers } from "..";
import GatherManager from "../services/gather";
import { GatherManagers, MapSetObjectsData } from "../types";
import { getMapObjectById } from "../utils/objects";
import { getRandomArrayValue } from "../utils/random"

type Bug = {
  objId: string,
  spaceId: string,
  mapId: string
}

type BugCollection = {
  name: string,
  bugs: Bug[]
}

const bugCollections: BugCollection[] = [
  {
    name: 'First',
    bugs: [
      {
        objId: 'BarrelLitMetal - Nc5jVuh8lyMUbpZlCZVTa_29963bad-bab6-4749-b7cb-d004f8d554eb',
        spaceId: 'VSqg1CcrGZHUwtaT/Codecon-2022',
        mapId: 'escadas',
      },
      {
        objId: 'BarrelLitMetal - Nc5jVuh8lyMUbpZlCZVTa_3308167f-ec69-4cd9-91b9-109e86b63d1f',
        spaceId: 'VSqg1CcrGZHUwtaT/Codecon-2022',
        mapId: 'escadas',
      },
      {
        objId: 'BarrelLitMetal - Nc5jVuh8lyMUbpZlCZVTa_e8ab5d6d-94e9-4ff4-a490-e2ee1eaba428',
        spaceId: 'VSqg1CcrGZHUwtaT/Codecon-2022',
        mapId: 'onboarding',
      }
    ]
  }
]

class BugsSystem {
  private logLabel = 'BugSystem'
  private static instance: BugsSystem
  private mapsLoaded: Record<string, boolean> = {}
  private isInitializating = false
  private blankImage = 'https://cdn.gather.town/v0/b/gather-town-dev.appspot.com/o/objects%2Fblank.png?alt=media&token=6564fd34-433a-4e08-843a-5c4b50d6f9e5';
  private bugImage = 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/internal-dashboard/images/hZSWr066RzaCkkv8uIR-l'

  public static getInstance(): BugsSystem {
    if (!BugsSystem.instance) {
      BugsSystem.instance = new BugsSystem()
    }

    return BugsSystem.instance
  }

  private getRequiredMapsToLoad(bugCollections: BugCollection[]) {
    return bugCollections.reduce((maps: string[], collection) => {
      const bugMaps: string[] = collection.bugs.reduce((bugsMaps: string[], bug: Bug) => {
        return bugsMaps.includes(bug.mapId) ? bugsMaps : bugsMaps.concat(bug.mapId)
      }, [])
      return [...new Set(maps.concat(bugMaps))]
    }, [])
  }

  loadMaps(data: MapSetObjectsData, context: ServerClientEventContext, game: Game) {
    const mapId = data.mapSetObjects.mapId
    if (!mapId) return

    if (this.mapsLoaded[mapId]) return
    this.mapsLoaded[mapId] = true

    const requiredMapsToLoad = this.getRequiredMapsToLoad(bugCollections)

    const hasAllMapsLoaded = requiredMapsToLoad.every(mapId => this.mapsLoaded[mapId] === true)
    if (!hasAllMapsLoaded) return

    if (this.isInitializating) return
    console.log(`[${this.logLabel}] All ${requiredMapsToLoad.length} required maps have been loaded. Initialzing BugsSystem`)
    this.isInitializating = true
    this.initializeBugsSystem()
  }

  initializeBugsSystem() {
    this.hideAllBugs(gatherManagers, bugCollections)
    this.showRandomBug(bugCollections)
  }

  hideAllBugs(gatherManagers: GatherManagers, bugCollections: BugCollection[]) {
    Object.entries(gatherManagers).forEach(([ spaceId, gatherManager ]) => {
      this.hideAllBugsInSpace(bugCollections, spaceId, gatherManager.game)
    })
  }

  hideAllBugsInSpace(bugCollections: BugCollection[], spaceId: string, game: Game) {
    console.log(`[${this.logLabel}] Hiding all bugs on ${spaceId}`)
    bugCollections.forEach(bugCollection => {
      bugCollection.bugs.forEach(bug => {
        if (!spaceId.includes(bug.spaceId)) return
        this.hideBug(bug.objId, bug.mapId, game)
      })
    })
  }

  hideBug(objId: string, mapId: string, game: Game) {
    this.setBugObject(objId, mapId, false, game)
  }

  showRandomBug(bugCollections: BugCollection[]) {
    bugCollections.forEach(bugCollection => {
      const bug = getRandomArrayValue(bugCollection.bugs)
      const gatherManager = gatherManagers[bug.spaceId]
      if (!gatherManager) {
        console.log(`[${this.logLabel}] ERROR: GatherManager not found for ${bug.spaceId}`)
        return
      }

      console.log(`[${this.logLabel}] Showing a random bug for collection "${bugCollection.name}"`)
      setTimeout(() => {
        this.showBug(bug.objId, bug.mapId, gatherManager.game)
      }, 3000)
    })
  }

  showBug(objId: string, mapId: string, game: Game) {
    this.setBugObject(objId, mapId, true, game)
  }

  setBugObject(objId: string, mapId: string, active: boolean, game: Game) {
    const { key } = getMapObjectById(game, objId, mapId)
    game.engine.sendAction({
      $case: "mapSetObjects",
      mapSetObjects: {
        mapId,
        objects: {
          [key as number]: {
            type: active ? 6 : 0,
            highlighted: active ? this.bugImage : this.blankImage,
            normal: active ? this.bugImage : this.blankImage,
            propertiesJson: JSON.stringify({
              message: 'Bug'
            }),
            _tags: []
          }
        }
      },
    });
  }
}

export default BugsSystem