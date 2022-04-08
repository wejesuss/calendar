import { Session } from '../../domain/models/session'
import { AddSessionModel } from '../../domain/usecases/add-session'

export interface AddSessionRepository {
  add: (sessionData: AddSessionModel) => Promise<Session>
}
