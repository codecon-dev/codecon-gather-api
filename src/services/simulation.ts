// import { User } from "../types"
// import UserManager from "./users"

// export async function startUsersUpdateSimulation() {
//   const userManager = UserManager.getInstance()
//   const interval = setInterval(() => {
//     if (!userManager.hasLoadedUsers) return
//     clearInterval(interval)
//     simulateUserUpdateInMemory()
//   }, 1000)
// }

// function createSimulatedUsers() {
//   const userManager = UserManager.getInstance()
//   for (let i = 0; i < 500; i++) {
//     userManager.createUserInMemory({
//       gatherPlayerId: String(i),
//       gatherName: String(i)
//     })
//   }
// }

// function increaseUserSteps(user: User) {
//   if (!user.steps) {
//     user.steps = 0
//   }
//   user.steps = user.steps! + 1
//   return user
// }

// async function simulateUserUpdateInMemory() {
//   const userManager = UserManager.getInstance()
//   const usersInMemory = userManager.getUsersInMemory()

//   // createSimulatedUsers()

//   for (let i = 0; i < usersInMemory.length; i++) {
//     setInterval(() => {
//       usersInMemory[i] = increaseUserSteps(usersInMemory[i])
//       userManager.updateUserInMemory(usersInMemory[i])
//     }, 500)
//   }
// }