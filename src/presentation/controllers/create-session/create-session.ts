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
      const requiredFields = ['name', 'email', 'phone']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (typeof name !== 'string') {
        return badRequest(new InvalidParamError('name'))
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const isPhoneValid = this.phoneValidator.isValid(phone)
      if (!isPhoneValid) {
        return badRequest(new InvalidParamError('phone'))
      }
    } catch (error) {
      return internalServerError(new ServerError(error.stack))
    }
  }
}
