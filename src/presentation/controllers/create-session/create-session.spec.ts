import { CreateSessionController } from './create-session'
import { HttpRequest, EmailValidator, InvalidParamError, MissingParamError } from './create-session-protocols'

const makeFakeHttpRequest = (email: string): HttpRequest => ({
  body: {
    email
  }
})

const makeEmailValidatorStub = (): EmailValidator => {
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
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({ body: {} })

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('email')
    })
  })

  test('Should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const email = 'any_email'
    const httpRequest = makeFakeHttpRequest(email)
    await sut.handle(httpRequest)

    expect(emailValidatorSpy).toHaveBeenCalledWith(email)
  })

  test('Should return 400 if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const email = 'any_email'
    const httpRequest = makeFakeHttpRequest(email)
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new InvalidParamError('email')
    })
  })
})
