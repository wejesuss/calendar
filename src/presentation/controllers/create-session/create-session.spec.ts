import { CreateSessionController } from './create-session'
import {
  HttpRequest,
  GetSchedule,
  GetSession,
  GetScheduleOptions,
  GetSessionOptions,
  Schedule,
  Session,
  PartialSchedule,
  PartialSession,
  CreateTimeTo,
  AddSession,
  AddSessionModel,
  EmailValidator,
  PhoneValidator,
  CPFValidator,
  SessionDateValidator,
  SessionTimeValidator,
  InvalidParamError,
  MissingParamError,
  internalServerError,
  badRequest,
  ok
} from './create-session-protocols'

const makeFakeHttpRequest = (body?: any, sessionTime?: string, sessionDate?: string): HttpRequest => ({
  body: body ?? {
    name: 'any name',
    email: 'any_email',
    phone: 'any_phone',
    cpf: 'any_cpf',
    description: 'any_description',
    session_date: sessionDate ?? '2022/01/22',
    session_time: sessionTime ?? '10:00'
  }
})

const makeFakeSession = (): Session => ({
  id: 'valid_id',
  s_date: '2022/01/22',
  duration: 15,
  time_from: '10:00',
  time_to: '10:15',
  description: 'any_description',
  name: 'any name',
  email: 'any_email',
  phone: 'any_phone',
  cpf: 'any_cpf',
  price: 10000,
  paid: false,
  image_path: null,
  user_id: null,
  created_at: Date.now(),
  updated_at: Date.now()
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

const makeSessionDateValidatorStub = (): SessionDateValidator => {
  class SessionDateValidatorStub implements SessionDateValidator {
    isValid (sessionDate: string): boolean {
      return true
    }
  }

  return new SessionDateValidatorStub()
}

const makeSessionTimeValidatorStub = (): SessionTimeValidator => {
  class SessionTimeValidatorStub implements SessionTimeValidator {
    isValid (sessionTime: string): boolean {
      return true
    }
  }

  return new SessionTimeValidatorStub()
}

const makeGetScheduleStub = (): GetSchedule => {
  class GetScheduleStub implements GetSchedule {
    getAll: () => Promise<Schedule>
    async getPartial (scheduleOptions?: GetScheduleOptions): Promise<PartialSchedule> {
      return {
        duration: 15,
        activation_interval: 3,
        activation_interval_type: 30,
        availability: [
          { time_from: '09:45', time_to: '17:00' }
        ],
        replacements: [
          { date: '2022/01/23', time_from: '11:00', time_to: '16:00' },
          { date: '2022/01/24', time_from: '10:00', time_to: '19:00' }
        ]
      }
    }
  }

  return new GetScheduleStub()
}

const makeCreateTimeToStub = (): CreateTimeTo => {
  class CreateTimeToStub implements CreateTimeTo {
    create (timeFrom: string, duration: number): string {
      return '10:15'
    }
  }

  return new CreateTimeToStub()
}

const makeGetSessionStub = (): GetSession => {
  class GetSessionStub implements GetSession {
    async getPartial (sessionOptions?: GetSessionOptions): Promise<PartialSession[]> {
      return [{
        s_date: '2022/01/22',
        time_from: '13:30',
        time_to: '15:30',
        duration: 120
      }]
    }
  }

  return new GetSessionStub()
}

const makeAddSessionStub = (): AddSession => {
  class AddSessionStub implements AddSession {
    async add (sessionData: AddSessionModel): Promise<Session> {
      return {
        id: 'valid_id',
        s_date: '2022/01/22',
        duration: sessionData.duration,
        time_from: sessionData.time_from,
        time_to: sessionData.time_to,
        description: sessionData.description,
        name: sessionData.name,
        email: sessionData.email,
        phone: sessionData.phone,
        cpf: sessionData.cpf,
        price: 10000,
        paid: false,
        user_id: null,
        image_path: null,
        created_at: Date.now(),
        updated_at: Date.now()
      }
    }
  }

  return new AddSessionStub()
}

interface SutTypes {
  sut: CreateSessionController
  emailValidatorStub: EmailValidator
  phoneValidatorStub: PhoneValidator
  cpfValidatorStub: CPFValidator
  sessionDateValidatorStub: SessionDateValidator
  sessionTimeValidatorStub: SessionTimeValidator
  getScheduleStub: GetSchedule
  createTimeToStub: CreateTimeTo
  getSessionStub: GetSession
  addSessionStub: AddSession
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const phoneValidatorStub = makePhoneValidatorStub()
  const cpfValidatorStub = makeCPFValidatorStub()
  const sessionDateValidatorStub = makeSessionDateValidatorStub()
  const sessionTimeValidatorStub = makeSessionTimeValidatorStub()
  const getScheduleStub = makeGetScheduleStub()
  const createTimeToStub = makeCreateTimeToStub()
  const getSessionStub = makeGetSessionStub()
  const addSessionStub = makeAddSessionStub()
  const price = 10000

  const sut = new CreateSessionController(
    emailValidatorStub,
    phoneValidatorStub,
    cpfValidatorStub,
    sessionDateValidatorStub,
    sessionTimeValidatorStub,
    getScheduleStub,
    createTimeToStub,
    getSessionStub,
    addSessionStub,
    price
  )

  return {
    sut,
    emailValidatorStub,
    phoneValidatorStub,
    cpfValidatorStub,
    sessionDateValidatorStub,
    sessionTimeValidatorStub,
    getScheduleStub,
    createTimeToStub,
    getSessionStub,
    addSessionStub
  }
}

const time = 1642734000000 // 2022/01/22
jest.spyOn(Date, 'now').mockReturnValue(time)
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

  test('Should call SessionDateValidator with correct values', async () => {
    const { sut, sessionDateValidatorStub } = makeSut()
    const sessionDateValidatorSpy = jest.spyOn(sessionDateValidatorStub, 'isValid')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(sessionDateValidatorSpy).toHaveBeenCalledWith(httpRequest.body.session_date)
  })

  test('Should return 400 if SessionDateValidator returns false', async () => {
    const { sut, sessionDateValidatorStub } = makeSut()
    jest.spyOn(sessionDateValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_date')))
  })

  test('Should return 500 if SessionDateValidator throws', async () => {
    const { sut, sessionDateValidatorStub } = makeSut()
    jest.spyOn(sessionDateValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(internalServerError(new Error()))
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

  test('Should call SessionTimeValidator with correct values', async () => {
    const { sut, sessionTimeValidatorStub } = makeSut()
    const sessionTimeValidatorSpy = jest.spyOn(sessionTimeValidatorStub, 'isValid')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(sessionTimeValidatorSpy).toHaveBeenCalledWith(httpRequest.body.session_time)
  })

  test('Should return 400 if SessionTimeValidator returns false', async () => {
    const { sut, sessionTimeValidatorStub } = makeSut()
    jest.spyOn(sessionTimeValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))
  })

  test('Should return 500 if SessionTimeValidator throws', async () => {
    const { sut, sessionTimeValidatorStub } = makeSut()
    jest.spyOn(sessionTimeValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  test('Should call Date with correct values', async () => {
    const { sut } = makeSut()
    const originalDate = global.Date
    const dateSpy = jest.spyOn(global, 'Date')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(dateSpy).toHaveBeenCalledWith('2022/01/22')

    global.Date = originalDate
  })

  test('Should call GetSchedule with correct values', async () => {
    const { sut, getScheduleStub } = makeSut()
    const getScheduleSpy = jest.spyOn(getScheduleStub, 'getPartial')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(getScheduleSpy).toHaveBeenCalledWith({ weekDay: 6, year: 2022, month: 1, date: 22 })
  })

  test('Should return 500 if GetSchedule throws', async () => {
    const { sut, getScheduleStub } = makeSut()
    jest.spyOn(getScheduleStub, 'getPartial').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  test('Should call CreateTimeTo with correct values', async () => {
    const { sut, createTimeToStub } = makeSut()
    const createTimeToSpy = jest.spyOn(createTimeToStub, 'create')

    const httpRequest = makeFakeHttpRequest(null, '10:00')
    await sut.handle(httpRequest)

    expect(createTimeToSpy).toHaveBeenCalledWith('10:00', 15)
  })

  test('Should return 500 if CreateTimeTo throws', async () => {
    const { sut, createTimeToStub } = makeSut()
    jest.spyOn(createTimeToStub, 'create').mockImplementationOnce(() => {
      throw new Error('')
    })

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  test('Should return 400 if CreateTimeTo returns an empty string', async () => {
    const { sut, createTimeToStub, sessionTimeValidatorStub } = makeSut()
    jest.spyOn(sessionTimeValidatorStub, 'isValid').mockReturnValueOnce(true).mockReturnValueOnce(false)
    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('')

    const httpRequest = makeFakeHttpRequest(null, '23:59')
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))
  })

  test('Should return 400 if session date is not available', async () => {
    const { sut } = makeSut()
    const daysToFuture = 7776000000
    // session date is same as time
    jest.spyOn(Date.prototype, 'getTime').mockReturnValueOnce(time)

    const httpRequest = makeFakeHttpRequest()
    let httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_date')))

    // session date is greater than limit
    jest.spyOn(Date.prototype, 'getTime').mockReturnValueOnce(time + daysToFuture + 1000)

    httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_date')))
  })

  test('Should have normalizeTime and normalize just hours', async () => {
    const { sut } = makeSut()

    expect(sut).toHaveProperty('normalizeTime')

    const hours = sut.normalizeTime('09', 0)
    const normalizedHours = sut.normalizeTime('00', 0)
    const minutes = sut.normalizeTime('15', 1)

    expect(hours).toBe(9)
    expect(normalizedHours).toBe(24)
    expect(minutes).toBe(15)
  })

  test('Should call normalizeTime and normalize just timeTo', async () => {
    const { sut, getScheduleStub, createTimeToStub } = makeSut()
    const partialSchedule = {
      duration: 15,
      activation_interval: 3,
      activation_interval_type: 30,
      availability: [{ time_from: '23:00', time_to: '00:00' }],
      replacements: []
    }

    const normalizeTimeSpy = jest.spyOn(sut, 'normalizeTime')
    jest.spyOn(getScheduleStub, 'getPartial').mockResolvedValueOnce(partialSchedule)
    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('00:00')

    const httpRequest = makeFakeHttpRequest(null, '23:00')
    await sut.handle(httpRequest)

    const firstCall = normalizeTimeSpy.mock.calls[0]
    const secondCall = normalizeTimeSpy.mock.calls[2]

    expect(firstCall[0]).toBe('00')
    expect(firstCall[1]).toBe(0)

    expect(secondCall[0]).toBe('00')
    expect(secondCall[1]).toBe(0)
  })

  test('Should return 400 if session time is not available using schedule', async () => {
    const { sut, createTimeToStub } = makeSut()

    let httpRequest = makeFakeHttpRequest(null, '08:00')
    let httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    httpRequest = makeFakeHttpRequest(null, '09:15')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('18:00')
    httpRequest = makeFakeHttpRequest()
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('17:15')
    httpRequest = makeFakeHttpRequest()
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))
  })

  test('Should return 400 if session time is not available using replacement', async () => {
    const { sut, createTimeToStub } = makeSut()

    let httpRequest = makeFakeHttpRequest(null, '10:00', '2022/01/23')
    let httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('17:00')
    httpRequest = makeFakeHttpRequest(null, '12:00', '2022/01/23')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))
  })

  test('Should validate session date and time prioritizing replacement over the schedule', async () => {
    const { sut, createTimeToStub } = makeSut()

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('18:00')
    const httpRequest = makeFakeHttpRequest(null, '17:00', '2022/01/24')
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).not.toEqual(badRequest(new InvalidParamError('session_time')))
  })

  test('Should call GetSession with correct values', async () => {
    const { sut, getSessionStub } = makeSut()
    const getSessionSpy = jest.spyOn(getSessionStub, 'getPartial')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(getSessionSpy).toHaveBeenCalledWith({ year: 2022, month: 1, date: 22 })
  })

  test('Should return 500 if GetSession throws', async () => {
    const { sut, getSessionStub } = makeSut()
    jest.spyOn(getSessionStub, 'getPartial').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  test('Should return 400 if session time is not available using sessions', async () => {
    const { sut, createTimeToStub } = makeSut()

    let httpRequest = makeFakeHttpRequest(null, '14:00')
    let httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('14:00')
    httpRequest = makeFakeHttpRequest(null, '13:00')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('13:45')
    httpRequest = makeFakeHttpRequest(null, '13:00')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('13:30')
    httpRequest = makeFakeHttpRequest(null, '13:30')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    httpRequest = makeFakeHttpRequest(null, '14:00')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('15:00')
    httpRequest = makeFakeHttpRequest(null, '14:00')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('15:00')
    httpRequest = makeFakeHttpRequest(null, '15:15')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('15:30')
    httpRequest = makeFakeHttpRequest(null, '15:30')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('session_time')))
  })

  test('Should validate session time minutes with sessions time minutes', async () => {
    const { sut, createTimeToStub } = makeSut()

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('13:15')
    let httpRequest = makeFakeHttpRequest(null, '13:00')
    let httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).not.toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('13:30')
    httpRequest = makeFakeHttpRequest(null, '12:00')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).not.toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('15:45')
    httpRequest = makeFakeHttpRequest(null, '15:30')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).not.toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('16:45')
    httpRequest = makeFakeHttpRequest(null, '15:30')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).not.toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('16:00')
    httpRequest = makeFakeHttpRequest(null, '15:30')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).not.toEqual(badRequest(new InvalidParamError('session_time')))

    jest.spyOn(createTimeToStub, 'create').mockReturnValueOnce('13:30')
    httpRequest = makeFakeHttpRequest(null, '12:30')
    httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).not.toEqual(badRequest(new InvalidParamError('session_time')))
  })

  test('Should call AddSession with correct values', async () => {
    const { sut, addSessionStub } = makeSut()

    const addSessionSpy = jest.spyOn(addSessionStub, 'add')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(addSessionSpy).toHaveBeenCalledWith({
      s_date: '2022/01/22',
      duration: 15,
      time_from: '10:00',
      time_to: '10:15',
      name: 'any name',
      email: 'any_email',
      phone: 'any_phone',
      cpf: 'any_cpf',
      description: 'any_description',
      price: 10000
    })
  })

  test('Should return 500 if AddSession throws', async () => {
    const { sut, addSessionStub } = makeSut()
    jest.spyOn(addSessionStub, 'add').mockImplementationOnce(async () => {
      throw new Error()
    })

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeFakeSession()))
  })
})
