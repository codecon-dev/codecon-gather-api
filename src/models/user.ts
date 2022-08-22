import { Schema, model } from 'mongoose'
import { User } from '../types'

const UserSchema = new Schema<User>({
  gatherPlayerId: {
    type: String,
    required: true
  },
  gatherName: {
    type: String,
  },
  spacesByDate: {
    type: Schema.Types.Mixed
  }
})

const UserModel = model<User>('User', UserSchema)
export default UserModel