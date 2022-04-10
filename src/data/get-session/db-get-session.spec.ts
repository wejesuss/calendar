import { GetSession, GetSessionOptions, GetSessionRepository, PartialSession } from './db-get-session-protocols'
import { DbGetSession } from './db-get-session'

const makeFakeSessionOptions = (): GetSessionOptions => ({
  date: 22,
  month: 1,
  year: 2022
})

const makeFakePartialSession = (): PartialSession[] => ([{
  duration: 15,
  s_date: '2022/01/22',
  time_from: '09:30',
  time_to: '10:00'
}])

const makeGetSessionRepository = (): GetSessionRepository => {
  class GetSessionRepositoryStub implements GetSessionRepository {
    async getPartial (sessionOptions?: GetSessionOptions): Promise<PartialSession[]> {
      return makeFakePartialSession()
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

    const sessionOptions = makeFakeSessionOptions()
    await sut.getPartial(sessionOptions)

    expect(getSessionSpy).toHaveBeenCalledWith(sessionOptions)
  })

  test('Should throw if GetSessionRepository throws', async () => {
    const { sut, getSessionRepositoryStub } = makeSut()
    jest.spyOn(getSessionRepositoryStub, 'getPartial').mockRejectedValueOnce(new Error())

    const sessionOptions = makeFakeSessionOptions()
    const promise = sut.getPartial(sessionOptions)

    await expect(promise).rejects.toThrow()
  })

  test('Should return session on success', async () => {
    const { sut } = makeSut()

    const sessionOptions = makeFakeSessionOptions()
    const session = await sut.getPartial(sessionOptions)

    expect(session).toEqual(makeFakePartialSession())
  })
})
