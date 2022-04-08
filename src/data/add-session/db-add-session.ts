import { AddSession, AddSessionModel, AddSessionRepository, Session } from './db-add-session-protocols'

export class DbAddSession implements AddSession {
  constructor (
    private readonly price: number,
    private readonly addSessionRepository: AddSessionRepository
  ) { }

  async add (sessionData: AddSessionModel): Promise<Session> {
    const sessionDate = sessionData.s_date.split('/').join('-')

    await this.addSessionRepository.add(Object.assign(
      {}, sessionData,
      { s_date: sessionDate, price: this.price }
    ))

    return null
  }
}
