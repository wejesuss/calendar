import {
  Controller,
  HttpRequest,
  HttpResponse,
  GetSchedule,
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

  constructor (
    emailValidator: EmailValidator,
    phoneValidator: PhoneValidator,
    cpfValidator: CPFValidator,
    sessionDateValidator: SessionDateValidator,
    sessionTimeValidator: SessionTimeValidator,
    getSchedule: GetSchedule
  ) {
    this.emailValidator = emailValidator
    this.phoneValidator = phoneValidator
    this.cpfValidator = cpfValidator
    this.sessionDateValidator = sessionDateValidator
    this.sessionTimeValidator = sessionTimeValidator
    this.getSchedule = getSchedule
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

      await this.getSchedule.getPartial({ weekDay, year, month, date })
    } catch (error) {
      return internalServerError(new ServerError(error.stack))
    }
  }
}
