import { Schema, model } from 'mongoose'
import { User, ObjectInteraction, SpaceStats, Stats } from '../types'

const ObjectInteractionSchema = new Schema<ObjectInteraction>({
  objectId: String,
  mapId: String,
  count: Number
});

const StatsSchema = new Schema<Stats>({
  steps: Number,
  interactions: Number,
  objectInteractions: [ObjectInteractionSchema],
  messages: Number,
  isOnline: Boolean,
  lastJoined: Number,
  lastExited: Number,
  timeOnlineInMinutes: Number
});

const UserSchema = new Schema<User>({
  gatherPlayerId: {
    type: String,
    required: true
  },
  gatherName: {
    type: String,
    required: true
  },
  spaces: {
    type: Map,
    of: StatsSchema
  }
})

const UserModel = model<User>('User', UserSchema)
export default UserModel