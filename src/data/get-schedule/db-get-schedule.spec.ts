import { PartialSchedule, GetScheduleOptions, GetScheduleRepository } from './db-get-schedule-protocols'
import { DbGetSchedule } from './db-get-schedule'

const makeFakeScheduleOptions = (): GetScheduleOptions => ({
  weekDay: 2,
  date: 23,
  month: 2,
  year: 2022
})

const makeGetScheduleRepository = (): GetScheduleRepository => {
  class GetScheduleRepository {
    async getPartial (scheduleOptions?: GetScheduleOptions): Promise<PartialSchedule> {
      return null
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
  describe('getPartial', () => {
    test('Should call GetScheduleRepository with correct values', async () => {
      const { sut, getScheduleRepositoryStub } = makeSut()
      const getPartialSpy = jest.spyOn(getScheduleRepositoryStub, 'getPartial')

      const scheduleOptions = makeFakeScheduleOptions()
      await sut.getPartial(scheduleOptions)

      expect(getPartialSpy).toHaveBeenCalledWith(scheduleOptions)
    })
  })
})
