import { Elysia } from 'elysia'
import { MongoConnection } from './libs/MongoConnection'
import swagger from '@elysiajs/swagger'
import LogRoute from './routes/LogRoute'

const mongoConnection = MongoConnection.getInstance().connect()

const app = new Elysia().use(swagger())
LogRoute(app)

app.listen(3001, () => {
  console.log('🚀 Logging service running at http://localhost:3001')
})
