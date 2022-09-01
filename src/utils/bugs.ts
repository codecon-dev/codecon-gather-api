import { BugCollection } from "../types";

export function getAllBugsObjIds(bugCollections: BugCollection[]){
  const bugs = bugCollections.flatMap(collection => collection.bugs)
  return bugs.map(bug => bug.objId)
}