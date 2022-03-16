import { Schedule, TimeInterval } from '../models/schedule'

export interface GetScheduleOptions {
  weekDay: number
  year: number
  month: number
  date: number
}

type PickedPartialSchedule = Pick<Schedule, 'duration'|'activation_interval'|'activation_interval_type'|'replacements'>

export type PartialSchedule = {
  availability: TimeInterval[]
} & PickedPartialSchedule

export interface GetSchedule {
  getAll: () => Promise<Schedule>
  getPartial: (scheduleOptions?: GetScheduleOptions) => Promise<PartialSchedule>
}
