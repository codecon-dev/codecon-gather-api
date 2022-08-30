import { Game } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import BugsSystem from "../systems/bugs";
import { MapSetObjectsData } from "../types"

export function onMapSetObjects(data: MapSetObjectsData, context: ServerClientEventContext, game: Game) {
  const bugsSystemInstance = BugsSystem.getInstance()
  bugsSystemInstance.loadMaps(data, context, game)
}
