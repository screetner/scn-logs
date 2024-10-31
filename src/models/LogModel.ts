import mongoose, { Schema } from 'mongoose'
import { ILogDocument, LogStatus } from '../types/log.types'

const logSchema = new Schema<ILogDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(LogStatus),
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: 'activity_logs',
  },
)

// Compound index for common queries
logSchema.index({ userId: 1, timestamp: -1 })

const LogModel = mongoose.model<ILogDocument>('Log', logSchema)
export default LogModel
