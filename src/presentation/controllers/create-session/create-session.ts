import {
  Controller,
  HttpRequest,
  HttpResponse,
  GetSchedule,
  CreateTimeTo,
  EmailValidator,
  PhoneValidator,
  CPFValidator,
  SessionDateValidator,
  SessionTimeValidator,
  MissingParamError,
  InvalidParamError,
  internalServerError,
  ServerError,
  badRequest
} from './create-session-protocols'

export class CreateSessionController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly phoneValidator: PhoneValidator
  private readonly cpfValidator: CPFValidator
  private readonly sessionDateValidator: SessionDateValidator
  private readonly sessionTimeValidator: SessionTimeValidator
  private readonly getSchedule: GetSchedule
  private readonly createTimeTo: CreateTimeTo

  constructor (
    emailValidator: EmailValidator,
    phoneValidator: PhoneValidator,
    cpfValidator: CPFValidator,
    sessionDateValidator: SessionDateValidator,
    sessionTimeValidator: SessionTimeValidator,
    getSchedule: GetSchedule,
    createTimeTo: CreateTimeTo
  ) {
    this.emailValidator = emailValidator
    this.phoneValidator = phoneValidator
    this.cpfValidator = cpfValidator
    this.sessionDateValidator = sessionDateValidator
    this.sessionTimeValidator = sessionTimeValidator
    this.getSchedule = getSchedule
    this.createTimeTo = createTimeTo
  }

  normalizeTime (value: string, index: number): number {
    let valueNumber = Number(value)

    if (valueNumber === 0 && index === 0) valueNumber = 24

    return valueNumber
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, phone, cpf, session_date: sessionDate, session_time: sessionTime } = httpRequest.body

      const requiredFields = ['name', 'email', 'phone', 'cpf', 'description', 'session_date', 'session_time']
      const stringRequiredFields = ['name', 'description']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      for (const field of stringRequiredFields) {
        if (typeof httpRequest.body[field] !== 'string') {
          return badRequest(new InvalidParamError(field))
        }
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const isPhoneValid = this.phoneValidator.isValid(phone)
      if (!isPhoneValid) {
        return badRequest(new InvalidParamError('phone'))
      }

      const isCPFValid = this.cpfValidator.isValid(cpf)
      if (!isCPFValid) {
        return badRequest(new InvalidParamError('cpf'))
      }

      const isDateValid = this.sessionDateValidator.isValid(sessionDate)
      if (!isDateValid) {
        return badRequest(new InvalidParamError('session_date'))
      }

      const isTimeValid = this.sessionTimeValidator.isValid(sessionTime)
      if (!isTimeValid) {
        return badRequest(new InvalidParamError('session_time'))
      }

      const [year, month, date] = (sessionDate as string).split('/').map(Number)
      const sDate = new Date(year, month, date)
      const weekDay = sDate.getDay()

      const partialSchedule = await this.getSchedule.getPartial({ weekDay, year, month, date })

      this.createTimeTo.create(sessionTime as string, partialSchedule.duration)

      const today = Date.now()
      const sDateTime = sDate.getTime()
      const daysToFuture = (partialSchedule.activation_interval * partialSchedule.activation_interval_type) * 24 * 60 * 60 * 1000
      if (sDateTime <= today || sDateTime > (today + daysToFuture)) {
        return badRequest(new InvalidParamError('session_date'))
      }
    } catch (error) {
      return internalServerError(new ServerError(error.stack))
    }
  }
}
