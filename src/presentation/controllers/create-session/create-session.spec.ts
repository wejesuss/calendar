import { CreateSessionController } from './create-session'
import { EmailValidator } from '../../protocols/email-validator'

function makeEmailValidatorStub (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  sut: CreateSessionController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new CreateSessionController(emailValidatorStub)

  return { sut, emailValidatorStub }
}

describe('Create Session Controller', () => {
  test('Should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle({
      body: {
        email: 'any_email'
      }
    })

    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email')
  })
})
