import supertest from 'supertest'
import app from '../config/app'

describe('BodyParser Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test-body-parser', (req, res) =>
      res.send(req.body))

    await supertest(app)
      .post('/test-body-parser')
      .send({ ok: 'ok' })
      .expect({ ok: 'ok' })
  })
})
