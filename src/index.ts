import { Elysia } from 'elysia'
import { MongoConnection } from './libs/MongoConnection'
import swagger from '@elysiajs/swagger'
import LogRoute from './routes/LogRoute'
import cron from '@elysiajs/cron'
import { LogService } from './services/LogService'

const mongoConnection = MongoConnection.getInstance().connect()
const logService = LogService.getInstance()

const app = new Elysia()
  .use(swagger())
  .use(
    cron({
      name: 'delete-logs',
      pattern: '0 0 9 * * *',
      async run() {
        await logService.deleteUserLogs()
      }
    })
  )
LogRoute(app)

app.listen(3001, () => {
  console.log('🚀 Logging service running at http://localhost:3001')
})
