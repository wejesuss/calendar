import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  PhoneValidator,
  CPFValidator,
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

  constructor (emailValidator: EmailValidator, phoneValidator: PhoneValidator, cpfValidator: CPFValidator) {
    this.emailValidator = emailValidator
    this.phoneValidator = phoneValidator
    this.cpfValidator = cpfValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, phone, cpf, session_date: sessionDate } = httpRequest.body

      const requiredFields = ['name', 'email', 'phone', 'cpf', 'description', 'session_date', 'session_time']
      const stringRequiredFields = ['name', 'description', 'session_date', 'session_time']

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

      const [year, month, date] = (sessionDate as string).split('/').map(Number)
      const sDate = new Date(year, month, date)
      sDate.getDay()
    } catch (error) {
      return internalServerError(new ServerError(error.stack))
    }
  }
}
