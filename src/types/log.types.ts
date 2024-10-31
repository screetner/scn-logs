import { Document } from 'mongoose'

export enum LogStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface ILog {
  userId: string
  description: string
  status: LogStatus
  timestamp: Date
}

export interface ILogDocument extends ILog, Document {}
