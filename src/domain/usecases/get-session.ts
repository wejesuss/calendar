import { Session } from '../models'

export interface GetSessionOptions {
  year: number
  month: number
  date: number
}

export type PartialSession = Pick<Session, 'duration'|'s_date'|'time_from'|'time_to'>

export interface GetSession {
  getPartial: (sessionOptions?: GetSessionOptions) => Promise<PartialSession[]>
}
