import { PrismaClient } from '@prisma/client'
import { GetScheduleRepository } from '../../../../data/protocols/get-schedule-repository'
import { Schedule } from '../../../../domain/models/schedule'
import { GetScheduleOptions, PartialSchedule } from '../../../../domain/usecases/get-schedule'

export class PrismaScheduleRepository implements GetScheduleRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async getAll (): Promise<Schedule> {
    throw new Error('Not Implemented')
  }

  async getPartial (scheduleOptions?: GetScheduleOptions): Promise<PartialSchedule> {
    const { weekDay, date, month, year } = scheduleOptions
    const rDate = new Date(Date.UTC(year, month - 1, date))

    await this.prisma.schedule.findFirst({
      select: { duration: true, activationInterval: true, activationIntervalType: true }
    })

    await this.prisma.timeInterval.findMany({
      select: { week: true, timeFrom: true, timeTo: true },
      orderBy: { timeFrom: 'asc' },
      where: { week: { equals: weekDay } }
    })

    await this.prisma.replacement.findMany({
      select: { rDate: true, rTimeFrom: true, rTimeTo: true },
      orderBy: { rTimeFrom: 'asc' },
      where: { rDate: { equals: rDate } }
    })

    return null
  }
}
