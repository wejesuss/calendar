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
      const {
        name,
        email,
        phone,
        cpf,
        description,
        session_date: sessionDate
      } = httpRequest.body
      const requiredFields = ['name', 'email', 'phone', 'cpf', 'description', 'session_date']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (typeof name !== 'string') {
        return badRequest(new InvalidParamError('name'))
      }

      if (typeof description !== 'string') {
        return badRequest(new InvalidParamError('description'))
      }

      if (typeof sessionDate !== 'string') {
        return badRequest(new InvalidParamError('session_date'))
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
    } catch (error) {
      return internalServerError(new ServerError(error.stack))
    }
  }
}
