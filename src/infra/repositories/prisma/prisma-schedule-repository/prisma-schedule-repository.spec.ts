import { PrismaClient } from './prisma-schedule-repository-protocols'
import { PrismaScheduleRepository } from './prisma-schedule-repository'

interface SutTypes {
  sut: PrismaScheduleRepository
  prisma: PrismaClient
}

const prisma = new PrismaClient()
const makeSut = (): SutTypes => {
  const sut = new PrismaScheduleRepository(prisma)

  return { sut, prisma }
}

describe('PrismaScheduleRepository', () => {
  beforeEach(async () => {
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  test('Should call find on schedule, replacement and timeInterval with correct values', async () => {
    const { sut, prisma } = makeSut()
    const findIntervalTimeSpy = jest.spyOn(prisma.timeInterval, 'findMany')
    const findReplacementSpy = jest.spyOn(prisma.replacement, 'findMany')
    const findScheduleSpy = jest.spyOn(prisma.schedule, 'findFirst')

    const scheduleOptions = {
      weekDay: 6,
      year: 2022,
      month: 1,
      date: 22
    }
    await sut.getPartial(scheduleOptions)

    expect(findScheduleSpy).toHaveBeenCalledWith({
      select: { duration: true, activationInterval: true, activationIntervalType: true }
    })

    expect(findIntervalTimeSpy).toHaveBeenCalledWith({
      select: { week: true, timeFrom: true, timeTo: true },
      orderBy: { timeFrom: 'asc' },
      where: { week: { equals: scheduleOptions.weekDay } }
    })

    expect(findReplacementSpy).toHaveBeenCalledWith({
      select: { rDate: true, rTimeFrom: true, rTimeTo: true },
      orderBy: { rTimeFrom: 'asc' },
      where: { rDate: { equals: new Date('2022-01-22T00:00:00.000Z') } }
    })
  })
})
