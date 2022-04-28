import { Session } from '../../domain/models'
import { AddSessionModel } from '../../domain/usecases/add-session'

export interface AddSessionRepository {
  add: (sessionData: AddSessionModel) => Promise<Session>
}
