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
    process.on('SIGINT', this.shutdown.bind(this));
    process.on('SIGTERM', this.shutdown.bind(this));
  }

  private async shutdown(signal: string) {
    if (this.isShuttingDown) return
    console.log(`[ShutdownManager] Signal "${signal}" detected! Starting shutdown...`)
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

