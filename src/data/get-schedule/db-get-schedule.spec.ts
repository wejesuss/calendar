import { PartialSchedule, GetScheduleOptions, GetScheduleRepository, Schedule } from './db-get-schedule-protocols'
import { DbGetSchedule } from './db-get-schedule'

const makeFakeScheduleOptions = (): GetScheduleOptions => ({
  weekDay: 2,
  date: 23,
  month: 2,
  year: 2022
})

const makeFakeSchedule = (): Schedule => ({
  id: 1,
  duration: 15,
  activation_interval: 2,
  activation_interval_type: 30,
  availability_0: [{ time_from: '09:00', time_to: '12:30' }],
  availability_1: [{ time_from: '09:00', time_to: '12:30' }],
  availability_2: [{ time_from: '09:00', time_to: '12:30' }],
  availability_3: [{ time_from: '09:00', time_to: '12:30' }],
  availability_4: [{ time_from: '09:00', time_to: '12:30' }],
  availability_5: [{ time_from: '09:00', time_to: '12:30' }],
  availability_6: [{ time_from: '09:00', time_to: '12:30' }],
  replacements: [],
  created_at: 1649511107538,
  updated_at: 1649511107538
})

const makeFakePartialSchedule = (): PartialSchedule => ({
  duration: 15,
  activation_interval: 2,
  activation_interval_type: 30,
  availability: [{ time_from: '08:00', time_to: '15:00' }],
  replacements: []
})

const makeGetScheduleRepository = (): GetScheduleRepository => {
  class GetScheduleRepository {
    async getAll (): Promise<Schedule> {
      return makeFakeSchedule()
    }

    async getPartial (scheduleOptions?: GetScheduleOptions): Promise<PartialSchedule> {
      return makeFakePartialSchedule()
    }
  }

  return new GetScheduleRepository()
}

interface SutTypes {
  sut: DbGetSchedule
  getScheduleRepositoryStub: GetScheduleRepository
}

const makeSut = (): SutTypes => {
  const getScheduleRepositoryStub = makeGetScheduleRepository()
  const sut = new DbGetSchedule(getScheduleRepositoryStub)

  return { sut, getScheduleRepositoryStub }
}

describe('DbGetSchedule', () => {
  describe('getAll', () => {
    test('Should call GetScheduleRepository with correct values', async () => {
      const { sut, getScheduleRepositoryStub } = makeSut()
      const getAllSpy = jest.spyOn(getScheduleRepositoryStub, 'getAll')

      await sut.getAll()
      expect(getAllSpy).toHaveBeenCalled()
    })

    test('Should throw if GetScheduleRepository throws', async () => {
      const { sut, getScheduleRepositoryStub } = makeSut()
      jest.spyOn(getScheduleRepositoryStub, 'getAll').mockRejectedValueOnce(new Error())

      const promise = sut.getAll()
      await expect(promise).rejects.toThrow()
    })

    test('Should return schedule on success', async () => {
      const { sut } = makeSut()

      const schedule = await sut.getAll()
      expect(schedule).toEqual(makeFakeSchedule())
    })
  })

  describe('getPartial', () => {
    test('Should call GetScheduleRepository with correct values', async () => {
      const { sut, getScheduleRepositoryStub } = makeSut()
      const getPartialSpy = jest.spyOn(getScheduleRepositoryStub, 'getPartial')

      const scheduleOptions = makeFakeScheduleOptions()
      await sut.getPartial(scheduleOptions)

      expect(getPartialSpy).toHaveBeenCalledWith(scheduleOptions)
    })

    test('Should throw if GetScheduleRepository throws', async () => {
      const { sut, getScheduleRepositoryStub } = makeSut()
      jest.spyOn(getScheduleRepositoryStub, 'getPartial').mockRejectedValueOnce(new Error())

      const scheduleOptions = makeFakeScheduleOptions()
      const promise = sut.getPartial(scheduleOptions)

      await expect(promise).rejects.toThrow()
    })

    test('Should return schedule on success', async () => {
      const { sut } = makeSut()

      const scheduleOptions = makeFakeScheduleOptions()
      const schedule = await sut.getPartial(scheduleOptions)

      expect(schedule).toEqual(makeFakePartialSchedule())
    })
  })
})
