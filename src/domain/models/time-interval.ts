export interface TimeInterval {
  id: number
  week: number
  time_from: string
  time_to: string
}

export type TimeIntervalDTO = Pick<TimeInterval, 'week'|'time_from'|'time_to'>
