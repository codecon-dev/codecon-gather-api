import { User } from "../types";
import { wait } from "../utils/functions";
import { createOrUpdateUser, getAllUsers } from "./database";

class UserManager {
  private static instance: UserManager;
  private users: User[] = []
  public hasLoadedUsers = false

  private constructor() {
    this.loadUsersFromDatabase()
  }

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager()
    }

    return UserManager.instance
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
    while (true) {
      await this.updateUsersInDatabase()
    }
  }

  private async updateUsersInDatabase() {
    const users = this.getUsersInMemory()
    const userChunksToUpdate: User[][] = this.splitUsersIntoChunks(users, 100)

    for (let chunksIndex = 0; chunksIndex < userChunksToUpdate.length; chunksIndex++) {
      const chunk = userChunksToUpdate[chunksIndex]
      for (let usersIndex = 0; usersIndex < chunk.length; usersIndex++) {
        const user = users[usersIndex];
        await createOrUpdateUser(user)
      }
      console.log(`Updated chunk ${chunksIndex} with ${chunk.length} users`)
      await wait(1000)
    }
  }

  private async loadUsersFromDatabase() {
    this.users = await getAllUsers()
    this.hasLoadedUsers = true
    console.log('Users loaded!')
  }
}

export default UserManager
