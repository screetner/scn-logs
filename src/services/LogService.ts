import { FilterQuery } from 'mongoose'
import { ILog, ILogDocument } from '../types/log.types'
import LogModel from '../models/LogModel'

export class LogService {
  private static instance: LogService

  private constructor() {}

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService()
    }
    return LogService.instance
  }

  async createLog(logData: ILog) {
    try {
      const log = new LogModel(logData)
      await log.save()

      return {
        success: true,
        data: log.toObject(),
      }
    } catch (error) {
      throw new Error(`Failed to create log}`)
    }
  }

  async getLogs(
    query: FilterQuery<ILogDocument> = {},
    options: {
      limit?: number
      skip?: number
    } = {},
  ) {
    try {
      const { limit = 100, skip = 0 } = options

      const [logs, total] = await Promise.all([
        LogModel.find(query)
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        LogModel.countDocuments(query),
      ])

      return {
        success: true,
        data: {
          logs,
          pagination: {
            total,
            page: Math.floor(skip / limit) + 1,
            pageSize: limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      }
    } catch (error) {
      throw new Error(`Failed to retrieve logs`)
    }
  }

  async getUserLogs(userId: string) {
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const logs = await LogModel.find({
        userId,
        timestamp: { $gte: sevenDaysAgo },
      })
        .sort({ timestamp: -1 })
        .lean()

      return {
        success: true,
        data: logs,
      }
    } catch (error) {
      throw new Error(`Failed to retrieve user logs`)
    }
  }

  async deleteUserLogs() {
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      console.log('Deleting logs...')

      await LogModel.deleteMany({ timestamp: { $lt: sevenDaysAgo } }).exec()

      console.log('Logs deleted successfully')
    } catch (error) {
      console.error('Error deleting logs:', error)
      throw new Error(`Failed to delete logs`)
    }
  }
}
