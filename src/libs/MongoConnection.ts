import mongoose, { ConnectOptions } from 'mongoose'

const DATABASE_CONFIG = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/logs',
  options: {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  } as ConnectOptions,
}

export class MongoConnection {
  private static instance: MongoConnection
  private isConnected = false

  private constructor() {}

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection()
    }
    return MongoConnection.instance
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return
    }

    try {
      console.log('Connecting to MongoDB...')
      await mongoose.connect(DATABASE_CONFIG.uri, DATABASE_CONFIG.options)
      this.isConnected = true
      console.log('Successfully connected to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return
    }

    try {
      await mongoose.disconnect()
      this.isConnected = false
      console.log('Successfully disconnected from MongoDB')
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error)
      throw error
    }
  }
}
