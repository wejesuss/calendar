import { GetSession, GetSessionOptions, PartialSession, GetSessionRepository } from './db-get-session-protocols'

export class DbGetSession implements GetSession {
  constructor (private readonly getSessionRepository: GetSessionRepository) {}

  async getPartial (sessionOptions?: GetSessionOptions): Promise<PartialSession[]> {
    await this.getSessionRepository.getPartial(sessionOptions)
    return null
  }
}
