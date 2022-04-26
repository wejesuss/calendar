import { GetScheduleOptions, PrismaClient, Prisma, zeroPadder, PartialSchedule } from './prisma-schedule-repository-protocols'
import { PrismaScheduleRepository } from './prisma-schedule-repository'

const makeFakeScheduleOptions = (): GetScheduleOptions => ({
  weekDay: 6,
  year: 2022,
  month: 1,
  date: 22
})

const makeFindScheduleOptions = (): Prisma.ScheduleFindFirstArgs => ({
  select: {
    duration: true,
    activationInterval: true,
    activationIntervalType: true
  }
})

const makeFindTimeIntervalOptions = (scheduleOptions: GetScheduleOptions): Prisma.TimeIntervalFindManyArgs => ({
  select: {
    week: true,
    timeFrom: true,
    timeTo: true
  },
  orderBy: { timeFrom: 'asc' },
  where: { week: { equals: scheduleOptions.weekDay } }
})

const makeFindReplacementOptions = (scheduleOptions: GetScheduleOptions): Prisma.ReplacementFindManyArgs => ({
  select: {
    rDate: true,
    rTimeFrom: true,
    rTimeTo: true
  },
  orderBy: { rTimeFrom: 'asc' },
  where: { rDate: { equals: new Date(`${scheduleOptions.year}-${zeroPadder.pad(scheduleOptions.month)}-${scheduleOptions.date}T00:00:00.000Z`) } }
})

const makeFakePartialSchedule = (): PartialSchedule => ({
  duration: 60,
  activation_interval: 3,
  activation_interval_type: 30,
  replacements: [],
  availability: [
    {
      week: 6,
      time_from: '09:00',
      time_to: '17:00'
    }
  ]
})

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

    const scheduleOptions = makeFakeScheduleOptions()
    await sut.getPartial(scheduleOptions)

    expect(findScheduleSpy).toHaveBeenCalledWith(makeFindScheduleOptions())
    expect(findIntervalTimeSpy).toHaveBeenCalledWith(makeFindTimeIntervalOptions(scheduleOptions))
    expect(findReplacementSpy).toHaveBeenCalledWith(makeFindReplacementOptions(scheduleOptions))
  })

  test('Should return partial schedule on success', async () => {
    const { sut } = makeSut()

    const scheduleOptions = makeFakeScheduleOptions()
    const schedule = await sut.getPartial(scheduleOptions)

    expect(schedule).toEqual(makeFakePartialSchedule())
  })
})
