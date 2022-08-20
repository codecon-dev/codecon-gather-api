import { Position } from "../types";

export function isInsideArea(userPosition: Position, topLeftAreaPosition: Position, bottomRightAreaPosition: Position) {
  const isInsideXAxis = (userPosition.x! >= topLeftAreaPosition.x!) && (userPosition.x! <= bottomRightAreaPosition.x!)
  const isInsideYAxis = (userPosition.y! >= topLeftAreaPosition.y!) && (userPosition.y! <= bottomRightAreaPosition.y!)
  if (!isInsideXAxis || !isInsideYAxis) return false
  return true
}
