import { Schedule } from '../../domain/models/schedule'
import { GetSchedule, GetScheduleOptions, PartialSchedule } from '../../domain/usecases/get-schedule'
import { GetScheduleRepository } from '../protocols/get-schedule-repository'

export class DbGetSchedule implements GetSchedule {
  constructor (private readonly getScheduleRepository: GetScheduleRepository) {}

  async getAll (): Promise<Schedule> {
    throw new Error('Not Implemented')
  }

  async getPartial (scheduleOptions?: GetScheduleOptions): Promise<PartialSchedule> {
    await this.getScheduleRepository.getPartial(scheduleOptions)
    return null
  }
}
