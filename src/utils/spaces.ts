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

export function updateUserSpaceStat(user: User, friendlySpaceId: string, spaceStat: Record<string, any>) {
  const spaces = user.spaces || {}
  const space = spaces[friendlySpaceId] || {}
  return {
    ...user,
    spaces: {
      ...spaces,
      [friendlySpaceId]: {
        ...space,
        ...spaceStat
      }
    }
  }
}

export function getSpace(user: User, friendlySpaceId: string) {
  const spaces = user.spaces || {}
  return spaces[friendlySpaceId] || {}
}