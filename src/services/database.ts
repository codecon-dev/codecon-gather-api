import { connection, connect } from 'mongoose'
import UserModel from '../models/user'
import { User } from '../types'

async function connectDatabase() {
  try {
    if (connection.readyState === 0) {
      connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/gather?retryWrites=true&w=majority`)
    }
  } catch (error) {
    console.log(error)
  }
}

export async function createOrUpdateUser(user: User): Promise<User | undefined> {
  try {
    await connectDatabase()
    const databaseUser = await UserModel.findOneAndUpdate({ gatherPlayerId: user.gatherPlayerId }, user, {
      new: true,
      upsert: true
    })
    await databaseUser.save()
    return databaseUser
  } catch (error) {
    console.log(error)
  }
}

export async function increaseSteps(gatherPlayerId: string) {
  try {
    await connectDatabase()
    const databaseUser = await UserModel.updateOne(
      { gatherPlayerId },
      { $inc: { steps: 1 } }
    )
    return databaseUser
  } catch (error) {
    console.log(error)
  }
}

export async function getUser(gatherPlayerId: string): Promise<User | null> {
  try {
    await connectDatabase()
    const [user] = await UserModel.find({ gatherPlayerId }).lean()
    if (!user) {
      return null
    }
    return user
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    await connectDatabase()
    const allusers = await UserModel.find({}).lean()
    return allusers
  } catch (error) {
    console.log(error)
    return []
  }
}