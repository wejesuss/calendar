import { Session } from '../../domain/models/session'
import { AddSession, AddSessionModel } from '../../domain/usecases/add-session'
import { AddSessionRepository } from '../protocols/add-session-repository'

export class DbAddSession implements AddSession {
  constructor (private readonly addSessionRepository: AddSessionRepository) { }

  async add (sessionData: AddSessionModel): Promise<Session> {
    const sessionDate = sessionData.s_date.split('/').join('-')

    await this.addSessionRepository.add(Object.assign(
      {}, sessionData,
      { s_date: sessionDate }
    ))

    return null
  }
}
