import { ILogDocument, LogStatus } from '../types/log.types'
import { Elysia, t } from 'elysia'
import { FilterQuery } from 'mongoose'
import { LogService } from '../services/LogService'

const logService = LogService.getInstance()

export default (app: Elysia) =>
  app
    .post(
      '/logs',
      async ({ body }) => {
        const { userId, description, status } = body

        return await logService.createLog({
          userId,
          description,
          status: status as LogStatus,
          timestamp: new Date(),
        })
      },
      {
        body: t.Object({
          userId: t.String(),
          description: t.String(),
          status: t.Enum(LogStatus),
        }),
      },
    )

    .get('/logs', async ({ query }) => {
      const { userId, status, page = '1', limit = '100' } = query
      const filter: FilterQuery<ILogDocument> = {}

      if (userId) filter.userId = userId
      if (status) filter.status = status as LogStatus

      const pageNum = parseInt(page)
      const limitNum = parseInt(limit)
      const skip = (pageNum - 1) * limitNum

      return await logService.getLogs(filter, { skip, limit: limitNum })
    })
    .get('/api/logs/user/:userId', async ({ params }) => {
      return await logService.getUserLogs(params.userId)
    })
