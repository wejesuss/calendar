import { Express, Router } from 'express'
import fb from 'fast-glob'

export default (app: Express): void => {
  const apiRouter = Router()
  const pagesRouter = Router()
  app.use('/api', apiRouter)
  app.use('/', pagesRouter)

  fb.sync('**/src/main/routes/api/**routes.ts').forEach(async (file) => {
    (await import(`../../../${file}`)).default(apiRouter)
  })

  fb.sync('**/src/main/routes/pages/**routes.ts').forEach(async (file) => {
    (await import(`../../../${file}`)).default(pagesRouter)
  })
}
