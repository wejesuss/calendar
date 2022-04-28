import { Schedule } from '../../domain/models'
import { GetScheduleOptions, PartialSchedule } from '../../domain/usecases/get-schedule'

export interface GetScheduleRepository {
  getAll: () => Promise<Schedule>
  getPartial: (scheduleOptions?: GetScheduleOptions) => Promise<PartialSchedule>
}
