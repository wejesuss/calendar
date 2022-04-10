import { GetSessionOptions, PartialSession } from '../../domain/usecases/get-session'

export interface GetSessionRepository {
  getPartial: (sessionOptions?: GetSessionOptions) => Promise<PartialSession[]>
}
