import db from '../config/db'
import app from '../config/app'
import supertest from 'supertest'
import { zeroPadder } from '../../shared/zero-pad/zero-pad'

describe('CreateSession Route', () => {
  beforeAll(async () => {
    await db.$connect()
    await db.session.deleteMany()
  })

  afterAll(async () => {
    await db.$disconnect()
  })

  test('Should return created session on success', async () => {
    const today = new Date()
    today.setDate(today.getDate() + 1)
    const dTomorrow = today
    const year = zeroPadder.pad(dTomorrow.getFullYear())
    const month = zeroPadder.pad(dTomorrow.getMonth() + 1)
    const date = zeroPadder.pad(dTomorrow.getDate())
    const sessionDate = `${year}/${month}/${date}`

    await supertest(app)
      .post('/api/create-session')
      .send({
        name: 'Joe',
        email: 'joeeleven@gmail.com',
        phone: '11977889900',
        cpf: '38054581777',
        description: 'Some good description',
        session_date: sessionDate,
        session_time: '09:00'
      }).expect((res) => {
        const {
          id,
          name,
          email,
          cpf,
          phone,
          description,
          duration,
          s_date: sDate,
          time_from: timeFrom,
          time_to: timeTo,
          price,
          paid,
          image_path: imagePath,
          created_at: createdAt,
          updated_at: updatedAt
        } = res.body

        expect(id).toBeTruthy()
        expect(name).toBe('Joe')
        expect(email).toBe('joeeleven@gmail.com')
        expect(cpf).toBe('38054581777')
        expect(phone).toBe('11977889900')
        expect(description).toBe('Some good description')
        expect(duration).toBe(60)
        expect(sDate).toBe(sessionDate)
        expect(timeFrom).toBe('09:00:00')
        expect(timeTo).toBe('10:00:00')
        expect(price).toBe(10000)
        expect(paid).toBe(false)
        expect(imagePath).toBeFalsy()
        expect(createdAt).toBeTruthy()
        expect(updatedAt).toBeTruthy()
      })
  })
})
