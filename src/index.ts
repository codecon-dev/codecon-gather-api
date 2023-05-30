import GatherManager from "./services/gather";
import ShutdownManager from "./services/shutdown";
import UserManager from "./services/users";
import BugsSystem from "./systems/bugs";
import { getSpacesIdsFromEnv } from "./utils/spaces";
import { GatherManagers } from './types'
import AIManager from "./services/ai";
import ChatBotSystem from "./systems/chatbot";
require('dotenv').config()

// Global object with GatherManager instances for each SpaceId
// Useful in case you need to use a Game instance that is not
// triggered by a Gather event (move, interact, etc).
// For example something that is triggered by an interval or an external API.
export let gatherManagers: GatherManagers = {}

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

    new BugsSystem()
    new AIManager()
    new ChatBotSystem()
    new ShutdownManager(Object.values(gatherManagers))
  } catch (error) {
    console.log(error)
  }
}

start()