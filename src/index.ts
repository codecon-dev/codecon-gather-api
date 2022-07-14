import GatherManager from "./services/gather";
import ShutdownManager from "./services/shutdown";
import UserManager from "./services/users";
import { getSpacesIdsFromEnv } from "./utils/spaces";
require('dotenv').config()

// Global object with GatherManager instances for each SpaceId
// Useful in case you need to use a Game instance that is not
// triggered by a Gather event (move, interact, etc).
// For example something that is trigger by an interval or an external API.
export let gatherManagers: Record<string, GatherManager> = {}

async function start() {
  try {
    const userManager = UserManager.getInstance()
    await userManager.loadUsersFromDatabase()
    userManager.startUsersDatabaseUpdater()

    const spaceIds = getSpacesIdsFromEnv()
    await Promise.all(spaceIds.map(async (spaceId) => {
      const gatherManager = new GatherManager(spaceId)
      await gatherManager.connectAndSubscribeToEvents()
      gatherManagers[spaceId] = gatherManager
    }))

    new ShutdownManager(Object.values(gatherManagers))
  } catch (error) {
    console.log(error)
  }
}

start()