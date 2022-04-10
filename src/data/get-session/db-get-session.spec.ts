import { GetSessionOptions, PartialSession, GetSession } from '../../domain/usecases/get-session'
import { GetSessionRepository } from '../protocols/get-session-repository'
import { DbGetSession } from './db-get-session'

const makeGetSessionRepository = (): GetSessionRepository => {
  class GetSessionRepositoryStub implements GetSessionRepository {
    async getPartial (sessionOptions?: GetSessionOptions): Promise<PartialSession[]> {
      return null
    }
  }

  return new GetSessionRepositoryStub()
}

interface SutTypes {
  sut: GetSession
  getSessionRepositoryStub: GetSessionRepository
}

const makeSut = (): SutTypes => {
  const getSessionRepositoryStub = makeGetSessionRepository()
  const sut = new DbGetSession(getSessionRepositoryStub)

  return { sut, getSessionRepositoryStub }
}

describe('DbGetSession', () => {
  test('Should call GetSessionRepository with correct values', async () => {
    const { sut, getSessionRepositoryStub } = makeSut()

    const getSessionSpy = jest.spyOn(getSessionRepositoryStub, 'getPartial')

    await sut.getPartial({
      date: 22,
      month: 1,
      year: 2022
    })
    expect(getSessionSpy).toHaveBeenCalledWith({
      date: 22,
      month: 1,
      year: 2022
    })
  })
})
