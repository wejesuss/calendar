import { Schedule, GetScheduleOptions, GetScheduleRepository, PartialSchedule, PrismaClient, zeroPadder } from './prisma-schedule-repository-protocols'

export class PrismaScheduleRepository implements GetScheduleRepository {
  constructor (private readonly prisma: PrismaClient) {}

  mapSchedule (schedule: {
    duration: number
    activationInterval: number
    activationIntervalType: number
  }): {
      duration: number
      activation_interval: number
      activation_interval_type: number
    } {
    return {
      duration: schedule.duration,
      activation_interval: schedule.activationInterval,
      activation_interval_type: schedule.activationIntervalType
    }
  }

  mapTimeInterval (timeInterval: {
    week: number
    timeFrom: Date
    timeTo: Date
  }): {week: number, time_from: string, time_to: string} {
    const { timeFrom, timeTo, week } = timeInterval

    return {
      week,
      time_from: `${zeroPadder.pad(timeFrom.getUTCHours())}:${zeroPadder.pad(timeFrom.getUTCMinutes())}`,
      time_to: `${zeroPadder.pad(timeTo.getUTCHours())}:${zeroPadder.pad(timeTo.getUTCMinutes())}`
    }
  }

  mapReplacement (replacement: {
    rDate: Date
    rTimeFrom: Date
    rTimeTo: Date
  }): {
      date: string
      time_from: string
      time_to: string
    } {
    const { rDate, rTimeFrom, rTimeTo } = replacement

    const date = `${zeroPadder.pad(rDate.getUTCFullYear())}/${zeroPadder.pad(rDate.getUTCMonth() + 1)}/${zeroPadder.pad(rDate.getUTCDate())}`
    const timeFrom = `${zeroPadder.pad(rTimeFrom.getUTCHours())}:${zeroPadder.pad(rTimeFrom.getUTCMinutes())}`
    const timeTo = `${zeroPadder.pad(rTimeTo.getUTCHours())}:${zeroPadder.pad(rTimeTo.getUTCMinutes())}`

    return {
      date: date,
      time_from: timeFrom,
      time_to: timeTo
    }
  }

  async getAll (): Promise<Schedule> {
    throw new Error('Not Implemented')
  }

  async getPartial (scheduleOptions?: GetScheduleOptions): Promise<PartialSchedule> {
    const { weekDay, date, month, year } = scheduleOptions
    const rDate = new Date(Date.UTC(year, month - 1, date))

    const schedule = await this.prisma.schedule.findFirst({
      select: { duration: true, activationInterval: true, activationIntervalType: true }
    })

    const timeIntervals = await this.prisma.timeInterval.findMany({
      select: { week: true, timeFrom: true, timeTo: true },
      orderBy: { timeFrom: 'asc' },
      where: { week: { equals: weekDay } }
    })

    const replacements = await this.prisma.replacement.findMany({
      select: { rDate: true, rTimeFrom: true, rTimeTo: true },
      orderBy: { rTimeFrom: 'asc' },
      where: { rDate: { equals: rDate } }
    })

    const mappedSchedule = this.mapSchedule(schedule)
    const mappedTimeIntervals = timeIntervals.map((timeInterval) => this.mapTimeInterval(timeInterval))
    const mappedReplacements = replacements.map((replacement) => this.mapReplacement(replacement))

    return {
      ...mappedSchedule,
      availability: mappedTimeIntervals,
      replacements: mappedReplacements
    }
  }
}
