import { AddSessionModel, PrismaClient } from './prisma-session-repository-protocols'
import { PrismaSessionRepository } from './prisma-session-repository'

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

    const sessionData: AddSessionModel = {
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
    }

    await sut.add(sessionData)

    const addSessionData = {
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
    }

    expect(createSessionSpy).toHaveBeenCalledWith({ data: addSessionData })
  })
})
