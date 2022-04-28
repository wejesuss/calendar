import { Schedule, ScheduleDTO, TimeIntervalDTO, ReplacementDTO } from '../models'

export interface GetScheduleOptions {
  weekDay: number
  year: number
  month: number
  date: number
}

export type PartialSchedule = ScheduleDTO & {
  availability: TimeIntervalDTO[]
  replacements: ReplacementDTO[]
}

export interface GetSchedule {
  getAll: () => Promise<Schedule>
  getPartial: (scheduleOptions?: GetScheduleOptions) => Promise<PartialSchedule>
}
