import { User } from "../types";
import { getTodayDate } from "./spaces";

export function logSpaceStatsOnUserMovement(user: User, friendlySpaceId: string) {
  console.log(user.spacesByDate[getTodayDate()][friendlySpaceId])
}