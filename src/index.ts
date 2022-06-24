import GatherManager from "./services/gather";
import ShutdownManager from "./services/shutdown";
import UserManager from "./services/users";
require('dotenv').config()

async function start() {
  try {
    const gatherManager = GatherManager.getInstance()
    gatherManager.connect()
    await gatherManager.subscribeToConnection()
    gatherManager.subscribeToEvents()

    const userManager = UserManager.getInstance()
    userManager.startUsersDatabaseUpdater()

    // new ShutdownManager(gatherManager.unsubscribeFromConnection)
  } catch (error) {
    console.log(error)
  }
}

start()