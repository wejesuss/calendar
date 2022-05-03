import db from '../config/db'
import { Controller } from '../../presentation/protocols'
import { CreateSessionController } from '../../presentation/controllers/create-session/create-session'

import { EmailValidatorAdapter } from '../../utils/email-validator/email-validator-adapter'
import { CPFValidatorAdapter } from '../../utils/cpf-validator/cpf-validator-adapter'
import { PhoneValidatorAdapter } from '../../utils/phone-validator/phone-validator-adapter'
import { SessionDateValidatorAdapter } from '../../utils/session-date-validator/session-date-validator-adapter'
import { SessionTimeValidatorAdapter } from '../../utils/session-time-validator/session-time-validator-adapter'
import { CreateTimeToAdapter } from '../../utils/create-time-to/create-time-to'

import { DbGetSchedule } from '../../data/get-schedule/db-get-schedule'
import { DbAddSession } from '../../data/add-session/db-add-session'
import { DbGetSession } from '../../data/get-session/db-get-session'
import { PrismaScheduleRepository } from '../../infra/repositories/prisma/prisma-schedule-repository/prisma-schedule-repository'
import { PrismaSessionRepository } from '../../infra/repositories/prisma/prisma-session-repository/prisma-session-repository'

export const makeCreateSessionController = (): Controller => {
  const price = 10000
  const sessionDateOptions = { delimiters: ['/'], format: 'YYYY/MM/DD' }

  const emailValidatorAdapter = new EmailValidatorAdapter()
  const cpfValidatorAdapter = new CPFValidatorAdapter()
  const phoneValidatorAdapter = new PhoneValidatorAdapter()
  const sessionDateValidatorAdapter = new SessionDateValidatorAdapter(sessionDateOptions)
  const sessionTimeValidatorAdapter = new SessionTimeValidatorAdapter()
  const createTimeToAdapter = new CreateTimeToAdapter()

  const prisma = db
  const scheduleRepository = new PrismaScheduleRepository(prisma)
  const dbGetSchedule = new DbGetSchedule(scheduleRepository)
  const sessionRepository = new PrismaSessionRepository(prisma)
  const dbGetSession = new DbGetSession(sessionRepository)
  const dbAddSession = new DbAddSession(sessionRepository)

  return new CreateSessionController(
    emailValidatorAdapter,
    phoneValidatorAdapter,
    cpfValidatorAdapter,
    sessionDateValidatorAdapter,
    sessionTimeValidatorAdapter,
    dbGetSchedule,
    createTimeToAdapter,
    dbGetSession,
    dbAddSession,
    price
  )
}
