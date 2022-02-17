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
    type: Number
  },
})

const UserModel = model<User>('User', UserSchema)
export default UserModel