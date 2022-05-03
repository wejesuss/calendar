import app from '../config/app'
import supertest from 'supertest'
describe('ContentType Middleware', () => {
  test('Should set json as default content-type', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send('')
    })

    await supertest(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  test('Should set xml as content-type if enforced', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await supertest(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})
