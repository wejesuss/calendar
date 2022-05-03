import app from '../config/app'
import supertest from 'supertest'

describe('CORS Middleware', () => {
  test('Should set cors headers', async () => {
    app.get('/test-cors', (req, res) => res.send())

    await supertest(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
