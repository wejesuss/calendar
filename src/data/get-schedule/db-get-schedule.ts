import { Schedule, PartialSchedule, GetSchedule, GetScheduleOptions, GetScheduleRepository } from './db-get-schedule-protocols'

export class DbGetSchedule implements GetSchedule {
  constructor (private readonly getScheduleRepository: GetScheduleRepository) {}

  async getAll (): Promise<Schedule> {
    return this.getScheduleRepository.getAll()
  }

  async getPartial (scheduleOptions?: GetScheduleOptions): Promise<PartialSchedule> {
    return this.getScheduleRepository.getPartial(scheduleOptions)
  }
}
