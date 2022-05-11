import { readFile } from 'fs/promises'
import path from 'path'
import supertest from 'supertest'
import app from '../config/app'

describe('Static Public Content Middleware', () => {
  test('Should serve static files', async () => {
    const filePath = path.resolve(__dirname, '../../../', 'public', 'index.html')
    const fileContent = await readFile(filePath, { encoding: 'utf-8' })

    await supertest(app)
      .get('/')
      .expect((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.text).toBe(fileContent)
      })
      .expect('content-type', /html/)
  })
})
