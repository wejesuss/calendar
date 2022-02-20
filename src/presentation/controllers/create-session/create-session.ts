import {
  HttpRequest,
  HttpResponse,
  EmailValidator,
  MissingParamError,
  InvalidParamError,
  badRequest,
  internalServerError,
  ServerError
} from './create-session-protocols'

export class CreateSessionController {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
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

      const isFileValid = this.emailValidator.isValid(email)
      if (!isFileValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return internalServerError(new ServerError(error.stack))
    }
  }
}
