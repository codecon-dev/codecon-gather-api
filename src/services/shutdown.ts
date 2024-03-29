import process from 'process';
import GatherManager from './gather';
import UserMananger from "./users";

class ShutdownManager {
  private static instance: ShutdownManager;
  private isShuttingDown = false
  private gatherManagers: GatherManager[] = []

  constructor(gatherManagers: GatherManager[]) {
    this.gatherManagers = gatherManagers
    this.listenToProcessSignals()
  }

  private listenToProcessSignals() {
    process.on('SIGINT', this.runAndExit(this.shutdown.bind(this)));
    process.on('SIGTERM', this.runAndExit(this.shutdown.bind(this)));
  }

  private runAndExit(shutdown: () => Promise<void>) {
    return () => shutdown().finally(() => process.exit(0))
  }

  private async shutdown() {
    if (process.env.IS_RUNNING_ON_HEROKU !== 'true') return
    
    if (this.isShuttingDown) return
    console.log(`[ShutdownManager] Signal detected! Starting shutdown...`)
    this.isShuttingDown = true

    console.log('[ShutdownManager] Unsubscribing from Gather WebSocket connection...')
    this.gatherManagers.forEach((manager) => {
      manager.unsubscribeFromConnection()
    })

    console.log('[ShutdownManager] Disabling users database auto updater....')
    const userManager = UserMananger.getInstance()
    userManager.setKeepUpdatingUsers(false)
    await userManager.waitForLastUpdate()

    console.log('[ShutdownManager] Setting all users in memory as offline...')
    const users = userManager.getUsersInMemory()
    users.forEach(user => userManager.setUserAsOfflineInMemoryInAllSpaces(user))

    console.log('[ShutdownManager] Updating database users one last time...')
    await userManager.updateUsersInDatabase()

    console.log('[ShutdownManager] Good bye!')
  }
}

export default ShutdownManager

