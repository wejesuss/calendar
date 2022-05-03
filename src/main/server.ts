import db from './config/db'

db.$connect().then(async () => {
  const app = (await import('./config/app')).default

  app.listen(5000, () => console.log('app listening on port 5000'))
}).catch(console.error)
