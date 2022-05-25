import { PrismaClient } from '@prisma/client'

if (process.env.NODE_ENV === 'production') {
  process.env.DATABASE_URL = process.env.HEROKU_POSTGRESQL_PUCE_URL
}

export default new PrismaClient()
