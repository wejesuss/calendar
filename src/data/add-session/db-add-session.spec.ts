import { Session } from '../../domain/models/session'
import { AddSessionModel } from '../../domain/usecases/add-session'
import { AddSessionRepository } from '../protocols/add-session-repository'
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
}

const makeSut = (): SutTypes => {
  const addSessionRepositoryStub = makeAddSessionRepository()
  const sut = new DbAddSession(addSessionRepositoryStub)

  return { sut, addSessionRepositoryStub }
}

describe('DbAddSession', () => {
  test('Should call AddSessionRepository with correct values', async () => {
    const { addSessionRepositoryStub, sut } = makeSut()
    const addSessionSpy = jest.spyOn(addSessionRepositoryStub, 'add')

    const sessionModel = makeFakeAddSessionModel()
    const addSessionData = Object.assign({}, sessionModel, { s_date: '2022-01-22' })

    await sut.add(sessionModel)
    expect(addSessionSpy).toHaveBeenCalledWith(addSessionData)
  })
})
