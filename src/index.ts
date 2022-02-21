import GatherManager from "./services/gather";
import ShutdownManager from "./services/shutdown";
import UserManager from "./services/users";
require('dotenv').config()

const apiKey = process.env.GATHER_API_KEY as string
const mapId = process.env.GATHER_MAP_ID as string
const spaceId = process.env.GATHER_SPACE_ID!.replace('/', '\\')

async function start() {
  try {
    const gatherManager = new GatherManager(apiKey, mapId, spaceId)
    gatherManager.connect()
    await gatherManager.subscribeToConnection()
    gatherManager.subscribeToEvents()

    const userManager = UserManager.getInstance()
    userManager.startUsersDatabaseUpdater()

    new ShutdownManager(gatherManager.unsubscribeFromConnection)
  } catch (error) {
    console.log(error)
  }
}

start()