import { CreateSessionController } from './create-session'
import {
  HttpRequest,
  EmailValidator,
  PhoneValidator,
  CPFValidator,
  InvalidParamError,
  MissingParamError,
  internalServerError,
  badRequest
} from './create-session-protocols'

const makeFakeHttpRequest = (body?: any): HttpRequest => ({
  body: body ?? {
    name: 'any name',
    email: 'any_email',
    phone: 'any_phone',
    cpf: 'any_cpf',
    description: 'any_description',
    session_date: 'any_session_date',
    session_time: 'any_session_time'
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

const makeCPFValidatorStub = (): CPFValidator => {
  class CPFValidatorStub implements CPFValidator {
    isValid (cpf: string): boolean {
      return true
    }
  }

  return new CPFValidatorStub()
}

interface SutTypes {
  sut: CreateSessionController
  emailValidatorStub: EmailValidator
  phoneValidatorStub: PhoneValidator
  cpfValidatorStub: CPFValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const phoneValidatorStub = makePhoneValidatorStub()
  const cpfValidatorStub = makeCPFValidatorStub()
  const sut = new CreateSessionController(emailValidatorStub, phoneValidatorStub, cpfValidatorStub)

  return {
    sut,
    emailValidatorStub,
    phoneValidatorStub,
    cpfValidatorStub
  }
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

    const httpRequest = makeFakeHttpRequest()
    httpRequest.body = {
      ...httpRequest.body,
      name: 42
    }

    const httpResponse = await sut.handle(httpRequest)
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

  test('Should return 500 if PhoneValidator throws', async () => {
    const { sut, phoneValidatorStub } = makeSut()
    jest.spyOn(phoneValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeHttpRequest()
    const promise = sut.handle(httpRequest)

    await expect(promise).resolves.toEqual(internalServerError(new Error()))
  })

  test('Should return 400 if no cpf is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        name: 'any name',
        email: 'any_email',
        phone: 'any_phone'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('cpf')))
  })

  test('Should call CPFValidator with correct value', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    const cpfValidatorSpy = jest.spyOn(cpfValidatorStub, 'isValid')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(cpfValidatorSpy).toHaveBeenCalledWith('any_cpf')
  })

  test('Should return 400 if CPFValidator returns false', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('cpf')))
  })

  test('Should return 500 if CPFValidator throws', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    jest.spyOn(cpfValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeHttpRequest()
    const promise = sut.handle(httpRequest)

    await expect(promise).resolves.toEqual(internalServerError(new Error()))
  })

  test('Should return 400 if no description is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        name: 'any name',
        email: 'any_email',
        phone: 'any_phone',
        cpf: 'any_cpf'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('description')))
  })

  test('Should return 400 if description is not a string', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeHttpRequest()
    httpRequest.body = {
      ...httpRequest.body,
      description: 42
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('description')))
  })

  test('Should return 400 if no session date is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        name: 'any name',
        email: 'any_email',
        phone: 'any_phone',
        cpf: 'any_cpf',
        description: 'any_description'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('session_date')))
  })

  test('Should return 400 if session date is not a string', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeHttpRequest()
    httpRequest.body = {
      ...httpRequest.body,
      session_date: 42
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_date')))
  })

  test('Should return 400 if no session time is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        name: 'any name',
        email: 'any_email',
        phone: 'any_phone',
        cpf: 'any_cpf',
        description: 'any_description',
        session_date: 'any_session_date'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('session_time')))
  })

  test('Should return 400 if session time is not a string', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeHttpRequest()
    httpRequest.body = {
      ...httpRequest.body,
      session_time: 42
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))
  })

  test('Should call Date with correct values', async () => {
    const { sut } = makeSut()
    const originalDate = global.Date
    const dateSpy = jest.spyOn(global, 'Date')

    const httpRequest = makeFakeHttpRequest()
    httpRequest.body = {
      ...httpRequest.body,
      session_date: '2022/01/22'
    }

    await sut.handle(httpRequest)

    expect(dateSpy).toHaveBeenCalledWith(2022, 1, 22)

    global.Date = originalDate
  })

  test('Should call Date getDay to get the day of the week', async () => {
    const { sut } = makeSut()
    const daySpy = jest.spyOn(Date.prototype, 'getDay')

    const httpRequest = makeFakeHttpRequest()
    httpRequest.body = {
      ...httpRequest.body,
      session_date: '2022/01/22'
    }

    await sut.handle(httpRequest)

    expect(daySpy).toReturnWith(2)
  })
})
