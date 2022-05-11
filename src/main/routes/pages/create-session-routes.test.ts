import app from '../../config/app'
import supertest from 'supertest'

describe('CreateSession Page Route', () => {
  test('Should return create session page on success', async () => {
    await supertest(app)
      .get('/create-session')
      .expect(200)
  })
})
