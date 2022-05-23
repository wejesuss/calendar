import express from 'express'
import fb from 'fast-glob'

export default (app: express.Express): void => {
  const apiRouter = express.Router()
  app.use('/api', apiRouter)

  fb.sync('**/src/main/routes/api/**routes.ts').forEach(async (file) => {
    (await import(`../../../${file}`)).default(apiRouter)
  })
}
