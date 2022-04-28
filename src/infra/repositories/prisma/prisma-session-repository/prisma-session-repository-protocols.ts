export { Session } from '../../../../domain/models'
export { AddSessionModel } from '../../../../domain/usecases/add-session'
export { AddSessionRepository } from '../../../../data/protocols/add-session-repository'
export { GetSessionOptions, PartialSession } from '../../../../domain/usecases/get-session'
export { GetSessionRepository } from '../../../../data/protocols/get-session-repository'
export { PrismaClient, Prisma } from '@prisma/client'

export interface UnmappedPartialSession {
  duration: number
  sDate: Date
  timeFrom: Date
  timeTo: Date
}
