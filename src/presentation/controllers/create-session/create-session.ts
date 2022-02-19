import { HttpRequest, HttpResponse, EmailValidator, MissingParamError, InvalidParamError } from './create-session-protocols'

export class CreateSessionController {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body

    if (!email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }

    const isFileValid = this.emailValidator.isValid(email)
    if (!isFileValid) {
      return {
        statusCode: 400,
        body: new InvalidParamError('email')
      }
    }
  }
}
