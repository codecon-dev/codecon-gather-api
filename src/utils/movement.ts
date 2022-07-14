import { PlayerMovesEventData, Position } from "../types"

export function getMovement(playerPosition: Position, previousPlayerPosition: Position) {
  if (!previousPlayerPosition) return 'None'
  const x = playerPosition.x
  const previousX = previousPlayerPosition.x!
  const y = playerPosition.y
  const previousY = previousPlayerPosition.y!
  if (y === (previousY - 1)) return "Up"
  if (y === (previousY + 1)) return "Down"
  if (x === (previousX + 1)) return "Right"
  if (x === (previousX - 1)) return "Left"
  if (x === previousX && y === previousY) return "Same"
  return 'None'
}

export function hasMatchingCoordinates(playerCoord: Position, targetCoord: Position) {
  if (playerCoord.x !== targetCoord.x) return false
  if (playerCoord.y !== targetCoord.y) return false
  if (targetCoord.direction && playerCoord.direction !== targetCoord.direction) return false
  return true
}

export function getPosition(data: PlayerMovesEventData): Position {
  return {
    x: data.playerMoves?.x,
    y: data.playerMoves?.y,
    direction: data.playerMoves?.direction,
  }
}