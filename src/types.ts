import { ServerClientEventByCase, SpriteDirectionEnum_ENUM } from "@gathertown/gather-game-client";

export type PlayerMovesEventData = ServerClientEventByCase<'playerMoves'>
export type PlayerInteractsEventData = ServerClientEventByCase<'playerInteracts'>
export type PlayerChatsEventData = ServerClientEventByCase<'playerChats'>

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

export type User = {
  gatherPlayerId: string
  gatherName: string
  steps?: number,
  interactions?: number,
  objectInteractions?: ObjectInteraction[],
  messages?: number,
}