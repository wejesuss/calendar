import { Schedule, TimeInterval } from '../models/schedule'

export interface GetScheduleOptions {
  weekDay: number
  year: number
  month: number
  date: number
}

type PartialSchedule = Pick<Schedule, 'duration'|'activation_interval'|'activation_interval_type'|'replacements'>
export type ObtainedSchedule = {
  availability: TimeInterval[]
} & PartialSchedule

export interface GetSchedule {
  get: (scheduleOptions?: GetScheduleOptions) => Promise<ObtainedSchedule | Schedule>
}
