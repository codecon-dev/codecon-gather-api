import { Schema, model } from 'mongoose'
import { User, ObjectInteraction } from '../types'

const ObjectInteractionSchema = new Schema<ObjectInteraction>({
  objectId: String,
  mapId: String,
  count: Number
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
  steps: {
    type: Number,
    default: 0
  },
  interactions: {
    type: Number,
    default: 0
  },
  objectInteractions: {
    type: [ObjectInteractionSchema],
    default: [],
  },
  messages: {
    type: Number,
    default: 0
  }
})

const UserModel = model<User>('User', UserSchema)
export default UserModel