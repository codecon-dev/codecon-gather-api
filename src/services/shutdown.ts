import process from 'process';
import UserMananger from "./users";

class ShutdownManager {
  private static instance: ShutdownManager;
  private unsubscribeFromConnection: () => void;
  private isShuttingDown = false

  constructor(unsubscribeFromConnection: () => void) {
    this.unsubscribeFromConnection = unsubscribeFromConnection
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
    this.unsubscribeFromConnection()

    console.log('[ShutdownManager] Disabling users database auto updater....')
    const userManager = UserMananger.getInstance()
    userManager.setKeepUpdatingUsers(false)
    userManager.stopCurrentUpdate(true)
    await userManager.waitForLastUpdate()

    console.log('[ShutdownManager] Setting all users in memory as offline...')
    const users = userManager.getUsersInMemory()
    users.forEach(user => userManager.setUserAsOfflineInMemory(user))

    console.log('[ShutdownManager] Updating database users one last time...')
    await userManager.updateUsersInDatabase()

    console.log('[ShutdownManager] Good bye!')
    process.exit(0)
  }
}

export default ShutdownManager

