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
  description: 'any description'
})

const makeAddSessionRepository = (): AddSessionRepository => {
  class AddSessionRepository {
    async add (sessionData: AddSessionModel): Promise<Session> {
      return null
    }
  }

  return new AddSessionRepository()
}

interface SutTypes {
  sut: DbAddSession
  addSessionRepositoryStub: AddSessionRepository
  price: number
}

const makeSut = (): SutTypes => {
  const addSessionRepositoryStub = makeAddSessionRepository()
  const price = 10000
  const sut = new DbAddSession(price, addSessionRepositoryStub)

  return { sut, addSessionRepositoryStub, price }
}

describe('DbAddSession', () => {
  test('Should call AddSessionRepository with correct values', async () => {
    const { addSessionRepositoryStub, sut, price } = makeSut()
    const addSessionSpy = jest.spyOn(addSessionRepositoryStub, 'add')

    const sessionModel = makeFakeAddSessionModel()
    const sessionDate = sessionModel.s_date.split('/').join('-')
    const addSessionData = Object.assign({}, sessionModel, { s_date: sessionDate, price })

    await sut.add(sessionModel)
    expect(addSessionSpy).toHaveBeenCalledWith(addSessionData)
  })
})
