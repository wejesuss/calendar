import { GetScheduleOptions, PartialSchedule } from '../../domain/usecases/get-schedule'

export interface GetScheduleRepository {
  getPartial: (scheduleOptions?: GetScheduleOptions) => Promise<PartialSchedule>
}
