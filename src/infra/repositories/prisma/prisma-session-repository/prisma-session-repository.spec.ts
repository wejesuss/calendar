import { AddSessionModel, PrismaClient } from './prisma-session-repository-protocols'
import { PrismaSessionRepository } from './prisma-session-repository'

const makeFakeSessionData = (): AddSessionModel => ({
  s_date: '2022-01-22',
  time_from: '09:00',
  time_to: '10:00',
  duration: 60,
  name: 'any_name',
  email: 'any_email@example.com',
  cpf: '11111111111',
  phone: '11111111111',
  description: '',
  price: 10000
})

const makeFakeAddSessionData = (sessionData: AddSessionModel): any => ({
  duration: 60,
  name: 'any_name',
  email: 'any_email@example.com',
  cpf: '11111111111',
  phone: '11111111111',
  description: '',
  price: 10000,
  sDate: new Date(`2022-01-22 ${sessionData.time_from}`),
  timeFrom: new Date(`2022-01-22 ${sessionData.time_from}`),
  timeTo: new Date(`2022-01-22 ${sessionData.time_to}`)
})

interface SutTypes {
  sut: PrismaSessionRepository
  prisma: PrismaClient
}

const makeSut = (): SutTypes => {
  const prisma = new PrismaClient()
  const sut = new PrismaSessionRepository(prisma)

  return { prisma, sut }
}

describe('PrismaSessionRepository', () => {
  test('Should call create on session with correct values', async () => {
    const { sut, prisma } = makeSut()
    const createSessionSpy = jest.spyOn(prisma.session, 'create')

    const sessionData = makeFakeSessionData()
    await sut.add(sessionData)

    const addSessionData = makeFakeAddSessionData(sessionData)
    expect(createSessionSpy).toHaveBeenCalledWith({ data: addSessionData })
  })

  test('Should return session on success', async () => {
    const { sut } = makeSut()

    const sessionData = makeFakeSessionData()
    const session = await sut.add(sessionData)

    expect(session.id).toBeTruthy()
    expect(session.cpf).toBeTruthy()
    expect(session.phone).toBeTruthy()
    expect(session.s_date).toEqual('2022/01/22')
    expect(session.time_from).toBe('09:00')
    expect(session.time_to).toBe('10:00')
    expect(session.duration).toBe(60)
    expect(session.name).toBe('any_name')
    expect(session.email).toBe('any_email@example.com')
    expect(session.description).toBe('')
    expect(session.price).toBe(10000)
    expect(session.paid).toBe(false)
    expect(session.user_id).toBeFalsy()
    expect(session.image_path).toBeFalsy()
  })
})
