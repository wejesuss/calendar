import { GetSession, GetSessionOptions, PartialSession } from '../../domain/usecases/get-session'
import { GetSessionRepository } from '../protocols/get-session-repository'

export class DbGetSession implements GetSession {
  constructor (private readonly getSessionRepository: GetSessionRepository) {}

  async getPartial (sessionOptions?: GetSessionOptions): Promise<PartialSession[]> {
    await this.getSessionRepository.getPartial(sessionOptions)
    return null
  }
}
