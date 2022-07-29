import { User } from "../types"

export function getSpacesIdsFromEnv() {
  let spaceIdNumber = 1
  const spaceIds = []
  while (process.env[`GATHER_SPACE_ID_${spaceIdNumber}`]) {
    spaceIds.push(process.env[`GATHER_SPACE_ID_${spaceIdNumber}`] as string)
    spaceIdNumber += 1
  }
  return spaceIds
}
export function getFriendlySpaceId(spaceId: string) {
  const splittedBySlash = spaceId.split('/')[1]
  if (splittedBySlash) return splittedBySlash
  return spaceId.split('\\')[1]
}

export function updateUserSpaceStat(user: User, friendlySpaceId: string, spaceStat: Record<string, any>): User {
  const todayDate = getTodayDate()
  const spacesByDate = user.spacesByDate || {}
  const spacesForCurrentDate = spacesByDate[todayDate] || {}
  const space = spacesForCurrentDate[friendlySpaceId] || {}
  return {
    ...user,
    spacesByDate: {
      ...spacesByDate,
      [todayDate]: {
        ...spacesForCurrentDate,
        [friendlySpaceId]: {
          ...space,
          ...spaceStat
        }
      }
    }
  }
}

export function getSpace(user: User, friendlySpaceId: string) {
  const todayDate = getTodayDate()
  const spacesByDate = user.spacesByDate || {}
  const spacesForCurrentDate = spacesByDate[todayDate] || {}
  return spacesForCurrentDate[friendlySpaceId] || {}
}

export function getTodayDate() {
  const todayDateString = new Date(Date.now()).toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
  return todayDateString.split(' ')[0]
}