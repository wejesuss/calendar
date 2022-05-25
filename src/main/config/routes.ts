import express from 'express'
import fb from 'fast-glob'
import path from 'path'

export default (app: express.Express): void => {
  const apiRouter = express.Router()
  app.use('/api', apiRouter)

  const cwd = path.resolve(__dirname, '../../')

  fb.sync('main/routes/api/**routes.[jt]s', { cwd }).forEach(async (file) => {
    (await import(`../../${file}`)).default(apiRouter)
  })
}
