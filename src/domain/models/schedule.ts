import { TimeInterval } from './time-interval'
import { Replacement } from './replacement'

export interface Schedule {
  id: number
  duration: number
  activation_interval: number
  activation_interval_type: number
  availability: TimeInterval[]
  replacements: Replacement[]
  created_at: number
  updated_at: number
}

export type ScheduleDTO = Pick<Schedule, 'duration'|'activation_interval'|'activation_interval_type'>
