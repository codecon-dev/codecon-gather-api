import { User } from "../types";
import { wait } from "../utils/time";
import { getTimeInMinutesSince } from "../utils/time";
import { createOrUpdateUser, getAllUsers } from "./database";

class UserManager {
  private static instance: UserManager;
  private users: User[] = []
  public hasLoadedUsers = false
  private isKeepUpdatingUsersActive = true
  private isStopCurrentUpdateActive = false
  private isUpdating = false

  private constructor() {
    this.loadUsersFromDatabase()
  }

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager()
    }

    return UserManager.instance
  }

  public setKeepUpdatingUsers(active: boolean) {
    this.isKeepUpdatingUsersActive = active
  }

  public stopCurrentUpdate(active: boolean) {
    this.isStopCurrentUpdateActive = active
  }

  public getUserInMemory(gatherPlayerId: string): User | undefined {
    const user = this.users.find(user => user.gatherPlayerId === gatherPlayerId)
    return user || undefined
  }

  public getUsersInMemory(): User[] {
    return this.users
  }

  public createUserInMemory(user: User) {
    this.users.push(user)
  }

  public updateUserInMemory(user: User) {
    const currentUser = this.users.find(usr => usr.gatherPlayerId === user.gatherPlayerId)
    if (!currentUser) {
      this.createUserInMemory(user)
      return
    }

    const currentUserIndex = this.users.indexOf(currentUser)
    this.users[currentUserIndex] = user
  }

  private splitUsersIntoChunks(users: User[], size: number) {
    return users.reduce((chunks: User[][], user: User, index: number) => {
      if (index % size) {
        const lastChunk = chunks[chunks.length - 1]
        lastChunk.push(user)
        return chunks
      }
      chunks.push([user])
      return chunks
    }, [])
  }

  public startUsersDatabaseUpdater() {
    const interval = setInterval(() => {
      if (!this.hasLoadedUsers) return
      clearInterval(interval)
      this.continuouslyUpdateUsersInDatabase()
    }, 1000)
  }

  private async continuouslyUpdateUsersInDatabase() {
    while (this.isKeepUpdatingUsersActive) {
      await this.updateUsersInDatabase()
    }
  }

  public async updateUsersInDatabase() {
    const users = this.getUsersInMemory()
    const userChunksToUpdate: User[][] = this.splitUsersIntoChunks(users, 100)

    this.isUpdating = true
    for (let chunksIndex = 0; chunksIndex < userChunksToUpdate.length; chunksIndex++) {
      const chunk = userChunksToUpdate[chunksIndex]
      for (let usersIndex = 0; usersIndex < chunk.length; usersIndex++) {
        if (this.isStopCurrentUpdateActive) {
          this.isStopCurrentUpdateActive = false
          this.isUpdating = false
          console.log('[UserManager] Stopping update cycle!')
          return
        }
        const user = users[usersIndex];
        await createOrUpdateUser(user)
      }
      console.log(`[UserManager] Updated chunk ${chunksIndex} with ${chunk.length} users`)
      await wait(1000)
    }
    this.isUpdating = false
  }

  public async waitForLastUpdate(): Promise<void> {
    return new Promise((resolve, reject) => {
      setInterval(() => {
        if (!this.isUpdating) resolve()
      }, 100);
    });
  }

  private async loadUsersFromDatabase() {
    this.users = await getAllUsers()
    this.hasLoadedUsers = true
    console.log('Users loaded!')
  }

  public setUserAsOfflineInMemory(user: User) {
    const timeSinceLastJoined = getTimeInMinutesSince(user.lastJoined!)
    const timeOnline = user.timeOnlineInMinutes
    const offlineUser = {
      ...user,
      isOnline: false,
      lastExited: Date.now(),
      timeOnlineInMinutes: timeOnline ? (timeOnline + timeSinceLastJoined) : timeSinceLastJoined
    }

    this.updateUserInMemory(offlineUser)
  }
}

export default UserManager
