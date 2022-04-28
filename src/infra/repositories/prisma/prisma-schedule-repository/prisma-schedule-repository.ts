import {
  Schedule,
  GetScheduleOptions,
  GetScheduleRepository,
  PartialSchedule,
  PrismaClient,
  zeroPadder,
  MappedReplacement,
  MappedSchedule,
  MappedTimeInterval,
  UnmappedReplacement,
  UnmappedSchedule,
  UnmappedTimeInterval
} from './prisma-schedule-repository-protocols'

export class PrismaScheduleRepository implements GetScheduleRepository {
  constructor (private readonly prisma: PrismaClient) {}

  mapSchedule (schedule: UnmappedSchedule): MappedSchedule {
    return {
      id: schedule.id,
      duration: schedule.duration,
      activation_interval: schedule.activationInterval,
      activation_interval_type: schedule.activationIntervalType,
      created_at: schedule.createdAt?.getTime(),
      updated_at: schedule.updatedAt?.getTime()
    }
  }

  mapTimeInterval (timeInterval: UnmappedTimeInterval): MappedTimeInterval {
    const {
      id,
      week,
      timeFrom,
      timeTo
    } = timeInterval

    return {
      id,
      week,
      time_from: `${zeroPadder.pad(timeFrom.getUTCHours())}:${zeroPadder.pad(timeFrom.getUTCMinutes())}`,
      time_to: `${zeroPadder.pad(timeTo.getUTCHours())}:${zeroPadder.pad(timeTo.getUTCMinutes())}`
    }
  }

  mapReplacement (replacement: UnmappedReplacement): MappedReplacement {
    const { id, rDate, rTimeFrom, rTimeTo, createdAt, updatedAt } = replacement

    const date = `${zeroPadder.pad(rDate.getUTCFullYear())}/${zeroPadder.pad(rDate.getUTCMonth() + 1)}/${zeroPadder.pad(rDate.getUTCDate())}`
    const timeFrom = `${zeroPadder.pad(rTimeFrom.getUTCHours())}:${zeroPadder.pad(rTimeFrom.getUTCMinutes())}`
    const timeTo = `${zeroPadder.pad(rTimeTo.getUTCHours())}:${zeroPadder.pad(rTimeTo.getUTCMinutes())}`

    return {
      id,
      date: date,
      time_from: timeFrom,
      time_to: timeTo,
      created_at: createdAt?.getTime(),
      updated_at: updatedAt?.getTime()
    }
  }

  async getAll (): Promise<Schedule> {
    await this.prisma.schedule.findFirst()
    await this.prisma.timeInterval.findMany({
      orderBy: [{ week: 'asc' }, { timeFrom: 'asc' }]
    })
    await this.prisma.replacement.findMany({
      orderBy: [{ rDate: 'asc' }, { rTimeFrom: 'asc' }]
    })

    return null
  }

  async getPartial (scheduleOptions?: GetScheduleOptions): Promise<PartialSchedule> {
    const schedule = await this.prisma.schedule.findFirst({
      select: { duration: true, activationInterval: true, activationIntervalType: true }
    })
    let timeIntervals = []
    let replacements = []

    if (scheduleOptions) {
      const { weekDay, date, month, year } = scheduleOptions
      const rDate = new Date(Date.UTC(year, month - 1, date))

      timeIntervals = await this.prisma.timeInterval.findMany({
        select: { week: true, timeFrom: true, timeTo: true },
        orderBy: { timeFrom: 'asc' },
        where: { week: { equals: weekDay } }
      })

      replacements = await this.prisma.replacement.findMany({
        select: { rDate: true, rTimeFrom: true, rTimeTo: true },
        orderBy: { rTimeFrom: 'asc' },
        where: { rDate: { equals: rDate } }
      })
    } else {
      timeIntervals = await this.prisma.timeInterval.findMany({
        select: { week: true, timeFrom: true, timeTo: true },
        orderBy: { timeFrom: 'asc' }
      })

      replacements = await this.prisma.replacement.findMany({
        select: { rDate: true, rTimeFrom: true, rTimeTo: true },
        orderBy: [{ rDate: 'asc' }, { rTimeFrom: 'asc' }]
      })
    }

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
