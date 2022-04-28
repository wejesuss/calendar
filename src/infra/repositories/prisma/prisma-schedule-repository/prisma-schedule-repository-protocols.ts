export { Schedule } from '../../../../domain/models'
export { GetScheduleOptions, PartialSchedule } from '../../../../domain/usecases/get-schedule'
export { GetScheduleRepository } from '../../../../data/protocols/get-schedule-repository'
export { PrismaClient, Prisma } from '@prisma/client'
export { zeroPadder } from '../../../../shared/zero-pad/zero-pad'

export interface UnmappedSchedule {
  id?: number
  duration: number
  activationInterval: number
  activationIntervalType: number
  createdAt?: Date
  updatedAt?: Date
}

export interface MappedSchedule {
  id?: number
  duration: number
  activation_interval: number
  activation_interval_type: number
  created_at?: number
  updated_at?: number
}

export interface UnmappedTimeInterval {
  id?: number
  week: number
  timeFrom: Date
  timeTo: Date
}

export interface MappedTimeInterval {
  id?: number
  week: number
  time_from: string
  time_to: string
}

export interface UnmappedReplacement {
  id?: number
  rDate: Date
  rTimeFrom: Date
  rTimeTo: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface MappedReplacement {
  id?: number
  date: string
  time_from: string
  time_to: string
  created_at?: number
  updated_at?: number
}
