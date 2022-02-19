import { HttpRequest, EmailValidator } from './create-session-protocols'

export class CreateSessionController {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<any> {
    const { email } = httpRequest.body

    const isFileValid = this.emailValidator.isValid(email)
    if (!isFileValid) {
      return {
        statusCode: 400,
        body: new Error('Invalid Param: email')
      }
    }
  }
}
