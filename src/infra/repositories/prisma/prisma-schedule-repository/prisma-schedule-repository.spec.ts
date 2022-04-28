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

const makeFakePartialSchedule = (week?: number, date?: string): PartialSchedule => {
  const partialSchedule = {
    duration: 60,
    activation_interval: 3,
    activation_interval_type: 30,
    replacements: [
      {
        date: '2022/01/23',
        time_from: '05:00',
        time_to: '10:00'
      },
      {
        date: '2022/01/23',
        time_from: '13:00',
        time_to: '16:00'
      },
      {
        date: '2022/01/24',
        time_from: '13:00',
        time_to: '16:00'
      }
    ],
    availability: [
      {
        week: 0,
        time_from: '05:00',
        time_to: '10:00'
      },
      {
        week: 6,
        time_from: '09:00',
        time_to: '17:00'
      }
    ]
  }

  if (week && date) {
    partialSchedule.availability = partialSchedule.availability.filter((timeInterval) => timeInterval.week === week)
    partialSchedule.replacements = partialSchedule.replacements.filter((replacement) => replacement.date === date)
  }

  return partialSchedule
}

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
  beforeAll(async () => {
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('getPartial', () => {
    test('Should call find on schedule, replacement and timeInterval with correct values', async () => {
      const { sut, prisma } = makeSut()
      const findScheduleSpy = jest.spyOn(prisma.schedule, 'findFirst')
      const findIntervalTimeSpy = jest.spyOn(prisma.timeInterval, 'findMany')
      const findReplacementSpy = jest.spyOn(prisma.replacement, 'findMany')

      const scheduleOptions = makeFakeScheduleOptions()
      await sut.getPartial(scheduleOptions)

      expect(findScheduleSpy).toHaveBeenCalledWith(makeFindScheduleOptions())
      expect(findIntervalTimeSpy).toHaveBeenCalledWith(makeFindTimeIntervalOptions(scheduleOptions))
      expect(findReplacementSpy).toHaveBeenCalledWith(makeFindReplacementOptions(scheduleOptions))
    })

    test('Should return all partial schedules if no schedule options is passed', async () => {
      const { sut } = makeSut()

      const schedule = await sut.getPartial()

      expect(schedule).toEqual(makeFakePartialSchedule())
    })

    test('Should return partial schedule on success', async () => {
      const { sut } = makeSut()

      const scheduleOptions = makeFakeScheduleOptions()
      const schedule = await sut.getPartial(scheduleOptions)

      expect(schedule).toEqual(makeFakePartialSchedule(6, '2022/01/22'))
    })

    test('Should throw if any of find functions throw', async () => {
      const { sut, prisma } = makeSut()
      const scheduleOptions = makeFakeScheduleOptions()

      jest.spyOn(prisma.timeInterval, 'findMany').mockImplementationOnce(() => {
        throw new Error()
      })
      let promise = sut.getPartial(scheduleOptions)
      await expect(promise).rejects.toThrow()

      jest.spyOn(prisma.replacement, 'findMany').mockImplementationOnce(() => {
        throw new Error()
      })
      promise = sut.getPartial(scheduleOptions)
      await expect(promise).rejects.toThrow()

      jest.spyOn(prisma.schedule, 'findFirst').mockImplementationOnce(() => {
        throw new Error()
      })
      promise = sut.getPartial(scheduleOptions)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('getAll', () => {
    test('Should call find on schedule, replacement and timeInterval with correct values', async () => {
      const { sut, prisma } = makeSut()
      const findScheduleSpy = jest.spyOn(prisma.schedule, 'findFirst')
      const findIntervalTimeSpy = jest.spyOn(prisma.timeInterval, 'findMany')
      const findReplacementSpy = jest.spyOn(prisma.replacement, 'findMany')

      await sut.getAll()

      expect(findScheduleSpy).toHaveBeenCalledWith()
      expect(findIntervalTimeSpy).toHaveBeenCalledWith({
        orderBy: [{ week: 'asc' }, { timeFrom: 'asc' }]
      })
      expect(findReplacementSpy).toHaveBeenCalledWith({
        orderBy: [{ rDate: 'asc' }, { rTimeFrom: 'asc' }]
      })
    })
  })
})
