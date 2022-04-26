export { PrismaClient, Prisma } from '@prisma/client'
export { GetScheduleRepository } from '../../../../data/protocols/get-schedule-repository'
export { Schedule } from '../../../../domain/models/schedule'
export { GetScheduleOptions, PartialSchedule } from '../../../../domain/usecases/get-schedule'
export { zeroPadder } from '../../../../shared/zero-pad/zero-pad'

export interface UnmappedSchedule {
  duration: number
  activationInterval: number
  activationIntervalType: number
}

export interface MappedSchedule {
  duration: number
  activation_interval: number
  activation_interval_type: number
}

export interface UnmappedTimeInterval {
  week: number
  timeFrom: Date
  timeTo: Date
}

export interface MappedTimeInterval {
  week: number
  time_from: string
  time_to: string
}

export interface UnmappedReplacement {
  rDate: Date
  rTimeFrom: Date
  rTimeTo: Date
}

export interface MappedReplacement {
  date: string
  time_from: string
  time_to: string
}
