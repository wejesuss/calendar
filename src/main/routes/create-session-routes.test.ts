import app from '../config/app'
import supertest from 'supertest'

describe('CreateSession Route', () => {
  test('Should return ok', async () => {
    await supertest(app)
      .post('/api/create-session')
      .expect(200, { ok: 'ok' })
  })
})
