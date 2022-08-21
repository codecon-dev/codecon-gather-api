import { SpriteDirectionEnum_ENUM, WireObject } from "@gathertown/gather-game-client";
import { ServerClientEventByCase } from "@gathertown/gather-game-client/dist/src/public/utils";

export type PlayerMovesEventData = ServerClientEventByCase<'playerMoves'>
export type PlayerInteractsEventData = ServerClientEventByCase<'playerInteracts'>
export type PlayerChatsEventData = ServerClientEventByCase<'playerChats'>
export type PlayerJoinsEventData = ServerClientEventByCase<'playerJoins'>
export type PlayerExitsEventData = ServerClientEventByCase<'playerExits'>
export type PlayerSetsEmoteEventData = ServerClientEventByCase<'playerSetsEmoteV2'>
export type PlayerSetsNameData = ServerClientEventByCase<'playerSetsName'>

export type Position = {
  x?: number,
  y?: number,
  direction?: SpriteDirectionEnum_ENUM
}

export type ObjectInteraction = {
  objectId: string,
  mapId: string,
  count: number
}

export type Stats = {
  steps?: number,
  interactions?: number,
  objectInteractions?: ObjectInteraction[],
  messages?: number,
  isOnline?: boolean,
  lastJoined?: number,
  lastExited?: number,
  timeOnlineInMinutes?: number
  standsVisited: string[]
}

export type SpaceStats = Record<string, Stats>

export type SpacesByDate = Record<string, SpaceStats>

export type User = {
  gatherPlayerId: string
  gatherName: string
  spacesByDate: SpacesByDate
}

export type WiredObjectListPerKey = Record<number, WireObject>

export type Stand = {
  standName: string
  friendlySpaceId: string
  visitors: string[]
}