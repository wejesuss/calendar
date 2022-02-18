import { EmailValidator } from '../../protocols/email-validator'

export class CreateSessionController {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: any): Promise<any> {
    const { email } = httpRequest.body

    this.emailValidator.isValid(email)
  }
}
