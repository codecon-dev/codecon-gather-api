import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/GameEventContexts";
import { gatherManagers } from "..";
import { bugCollections } from "../data/bugs";
import { Bug, BugCollection, GatherManagers, MapSetObjectsData } from "../types";
import { getMapObjectById } from "../utils/objects";
import { getRandomArrayValue } from "../utils/random"
import { wait } from "../utils/time";

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

  async initializeBugsSystem() {
    await this.hideAllBugs(gatherManagers, bugCollections)
    this.showRandomBug(bugCollections)
  }

  async hideAllBugs(gatherManagers: GatherManagers, bugCollections: BugCollection[]) {
    const managers = Object.entries(gatherManagers)
    for await (const [ spaceId, gatherManager ] of managers) {
      await this.hideAllBugsInSpace(bugCollections, spaceId, gatherManager.game)
    }
  }

  async hideAllBugsInSpace(bugCollections: BugCollection[], spaceId: string, game: Game) {
    console.log(`[${this.logLabel}] Hiding all bugs on ${spaceId}`)
    for await (const bugCollection of bugCollections) {
      for await (const bug of bugCollection.bugs) {
        if (!spaceId.includes(bug.spaceId)) return
        this.hideBug(bug.objId, bug.mapId, game)
        await wait(20) // To avoid hitting the 72 actions per second rate limit
      }
    }
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
            _tags: []
          }
        }
      },
    });
  }
}

export default BugsSystem