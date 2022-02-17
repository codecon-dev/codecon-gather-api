import { Schema, model } from 'mongoose'
import { User } from '../types'

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
})

const UserModel = model<User>('User', UserSchema)
export default UserModel