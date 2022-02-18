import { HttpRequest, EmailValidator } from './create-session-protocols'

export class CreateSessionController {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<any> {
    const { email } = httpRequest.body

    this.emailValidator.isValid(email)
  }
}
