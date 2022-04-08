import { AddSessionModel, AddSessionRepository, Session } from './db-add-session-protocols'
import { DbAddSession } from './db-add-session'

const makeFakeAddSessionModel = (): AddSessionModel => ({
  s_date: '2022/01/22',
  time_from: '10:30',
  time_to: '11:30',
  duration: 60,
  name: 'foo',
  email: 'foo@example.com',
  cpf: '11111111111',
  phone: '111111111',
  description: 'any description',
  price: 10000
})

const makeFakeSession = (): Session => ({
  id: 'valid_id',
  s_date: '2022-01-22',
  time_from: '10:30',
  time_to: '11:30',
  duration: 60,
  name: 'foo',
  email: 'foo@example.com',
  cpf: '11111111111',
  phone: '111111111',
  description: 'any description',
  image_path: '',
  price: 10000,
  user_id: '',
  paid: false,
  created_at: 1649452205230,
  updated_at: 1649452205230
})

const makeAddSessionRepository = (): AddSessionRepository => {
  class AddSessionRepositoryStub {
    async add (sessionData: AddSessionModel): Promise<Session> {
      return makeFakeSession()
    }
  }

  return new AddSessionRepositoryStub()
}

interface SutTypes {
  sut: DbAddSession
  addSessionRepositoryStub: AddSessionRepository
}

const makeSut = (): SutTypes => {
  const addSessionRepositoryStub = makeAddSessionRepository()
  const sut = new DbAddSession(addSessionRepositoryStub)

  return { sut, addSessionRepositoryStub }
}

describe('DbAddSession', () => {
  test('Should call AddSessionRepository with correct values', async () => {
    const { sut, addSessionRepositoryStub } = makeSut()
    const addSessionSpy = jest.spyOn(addSessionRepositoryStub, 'add')

    const sessionModel = makeFakeAddSessionModel()
    const sessionDate = sessionModel.s_date.split('/').join('-')
    const addSessionData = Object.assign({}, sessionModel, { s_date: sessionDate })

    await sut.add(sessionModel)
    expect(addSessionSpy).toHaveBeenCalledWith(addSessionData)
  })

  test('Should throw if AddSessionRepository throws', async () => {
    const { sut, addSessionRepositoryStub } = makeSut()
    jest.spyOn(addSessionRepositoryStub, 'add').mockRejectedValueOnce(new Error())

    const sessionModel = makeFakeAddSessionModel()

    const promise = sut.add(sessionModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should return session on success', async () => {
    const { sut } = makeSut()

    const sessionModel = makeFakeAddSessionModel()
    const session = await sut.add(sessionModel)

    expect(session).toEqual(makeFakeSession())
  })
})
