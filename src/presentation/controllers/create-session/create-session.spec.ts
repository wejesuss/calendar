import { CreateSessionController } from './create-session'
import {
  HttpRequest,
  EmailValidator,
  PhoneValidator,
  InvalidParamError,
  MissingParamError,
  badRequest,
  internalServerError
} from './create-session-protocols'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any name',
    email: 'any_email',
    phone: 'any_phone'
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

const makePhoneValidatorStub = (): PhoneValidator => {
  class PhoneValidatorStub implements PhoneValidator {
    isValid (phone: string): boolean {
      return true
    }
  }

  return new PhoneValidatorStub()
}

interface SutTypes {
  sut: CreateSessionController
  emailValidatorStub: EmailValidator
  phoneValidatorStub: PhoneValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const phoneValidatorStub = makePhoneValidatorStub()
  const sut = new CreateSessionController(emailValidatorStub, phoneValidatorStub)

  return { sut, emailValidatorStub, phoneValidatorStub }
}

describe('Create Session Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        email: 'any_email'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if name is not a string', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        name: 42,
        email: 'any_email',
        phone: 'any_phone'
      }
    })

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('name')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        name: 'any name'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should return 400 if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeHttpRequest()
    const promise = sut.handle(httpRequest)

    await expect(promise).resolves.toEqual(internalServerError(new Error()))
  })

  test('Should return 400 if no phone is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        name: 'any name',
        email: 'any_email'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('phone')))
  })

  test('Should call PhoneValidator with correct value', async () => {
    const { sut, phoneValidatorStub } = makeSut()
    const phoneValidatorSpy = jest.spyOn(phoneValidatorStub, 'isValid')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(phoneValidatorSpy).toHaveBeenCalledWith('any_phone')
  })

  test('Should return 400 if PhoneValidator returns false', async () => {
    const { sut, phoneValidatorStub } = makeSut()
    jest.spyOn(phoneValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('phone')))
  })
})
