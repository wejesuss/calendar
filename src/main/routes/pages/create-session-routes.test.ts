import app from '../../config/app'
import supertest from 'supertest'
import path from 'path'
import { readFile } from 'fs/promises'

describe('CreateSession Page Route', () => {
  test('Should return create session page on success', async () => {
    const filePath = path.resolve(__dirname, '../../../../', 'public', 'create-session', 'index.html')
    const fileContent = await readFile(filePath, { encoding: 'utf-8' })

    await supertest(app)
      .get('/create-session')
      .expect((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.text).toBe(fileContent)
      })
  })
})
