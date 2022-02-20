import {
  HttpRequest,
  HttpResponse,
  EmailValidator,
  MissingParamError,
  InvalidParamError,
  badRequest,
  internalServerError,
  ServerError,
  PhoneValidator
} from './create-session-protocols'

export class CreateSessionController {
  private readonly emailValidator: EmailValidator
  private readonly phoneValidator: PhoneValidator

  constructor (emailValidator: EmailValidator, phoneValidator: PhoneValidator) {
    this.emailValidator = emailValidator
    this.phoneValidator = phoneValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, phone } = httpRequest.body

      if (!name) {
        return badRequest(new MissingParamError('name'))
      }

      if (!email) {
        return badRequest(new MissingParamError('email'))
      }

      if (!phone) {
        return badRequest(new MissingParamError('phone'))
      }

      if (typeof name !== 'string') {
        return badRequest(new InvalidParamError('name'))
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      this.phoneValidator.isValid(phone)
    } catch (error) {
      return internalServerError(new ServerError(error.stack))
    }
  }
}
