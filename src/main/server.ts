import db from './config/db'

db.$connect().then(async () => {
  const app = (await import('./config/app')).default

  app.listen(process.env.PORT || 5000, () => console.log('app listening on port 5000'))
}).catch(console.error)
