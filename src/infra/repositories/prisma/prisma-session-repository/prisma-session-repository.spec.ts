import { AddSessionModel, PrismaClient, Prisma, GetSessionOptions, PartialSession } from './prisma-session-repository-protocols'
import { PrismaSessionRepository } from './prisma-session-repository'

const getEncryptionKey = (): string => process.env.CALENDAR_PG_ENCRYPTION_KEY

const makeFakeSessionData = (): AddSessionModel => ({
  s_date: '2022-01-22',
  time_from: '09:00',
  time_to: '10:00',
  duration: 60,
  name: 'any_name',
  email: 'any_email@example.com',
  cpf: '11111111111',
  phone: '11111111111',
  description: '',
  price: 10000
})

const makeInsertQuery = (sessionData: AddSessionModel): Prisma.Sql => {
  const timeFrom = new Date(`${sessionData.s_date} ${sessionData.time_from} GMT-00`)
  const timeTo = new Date(`${sessionData.s_date} ${sessionData.time_to} GMT-00`)

  const id = Prisma.sql`gen_random_uuid()`
  const cpfEncrypted = Prisma.sql`pgp_sym_encrypt(${sessionData.cpf}, ${getEncryptionKey()})`
  const phoneEncrypted = Prisma.sql`pgp_sym_encrypt(${sessionData.phone}, ${getEncryptionKey()})`

  return Prisma.sql`INSERT INTO session (id,name,email,cpf,phone,description,duration,s_date,time_from,time_to,price,user_id) VALUES (${id},${sessionData.name},${sessionData.email},${cpfEncrypted},${phoneEncrypted},${sessionData.description},${sessionData.duration},${timeFrom},${timeFrom},${timeTo},${sessionData.price},${sessionData.user_id}) RETURNING *;`
}

const makeFakeSessionOptions = (): GetSessionOptions => ({
  date: 22,
  month: 1,
  year: 2022
})

const makeFindManyOptions = (): Prisma.SessionFindManyArgs => ({
  select: { duration: true, sDate: true, timeFrom: true, timeTo: true },
  where: { sDate: { equals: new Date('2022-01-22T00:00:00.000Z') } },
  orderBy: { timeFrom: 'asc' }
})

const makePartialSessions = (sDate?: string): PartialSession[] => {
  const allPartialSessions = [
    {
      duration: 60,
      s_date: '2022/01/22',
      time_from: '09:00',
      time_to: '10:00'
    },
    {
      duration: 60,
      s_date: '2022/01/22',
      time_from: '10:00',
      time_to: '11:00'
    },
    {
      duration: 60,
      s_date: '2022/01/30',
      time_from: '10:00',
      time_to: '11:00'
    }
  ]

  if (!sDate) return allPartialSessions

  return allPartialSessions.filter((session) => session.s_date === sDate)
}

interface SutTypes {
  sut: PrismaSessionRepository
  prisma: PrismaClient
}

const makeSut = (): SutTypes => {
  const prisma = new PrismaClient()
  const sut = new PrismaSessionRepository(prisma)

  return { prisma, sut }
}

describe('PrismaSessionRepository', () => {
  beforeEach(async () => {
    const { sut, prisma } = makeSut()
    await prisma.$connect()

    await prisma.session.deleteMany()
    const sessionData = makeFakeSessionData()
    await sut.add(sessionData)

    sessionData.time_from = '10:00'
    sessionData.time_to = '11:00'
    await sut.add(sessionData)

    sessionData.s_date = '2022-01-30'
    await sut.add(sessionData)
  })

  afterAll(async () => {
    const { prisma } = makeSut()

    await prisma.$disconnect()
  })

  describe('AddSessionRepository', () => {
    test('Should call insert on session with correct values', async () => {
      const { sut, prisma } = makeSut()
      const insertSessionSpy = jest.spyOn(prisma, '$queryRaw')

      const sessionData = makeFakeSessionData()
      const insertQuery = makeInsertQuery(sessionData)

      await sut.add(sessionData)
      expect(insertSessionSpy).toHaveBeenCalledWith(insertQuery)
    })

    test('Should return session on success', async () => {
      const { sut } = makeSut()

      const sessionData = makeFakeSessionData()
      const session = await sut.add(sessionData)

      expect(session.id).toBeTruthy()
      expect(session.cpf).toBeTruthy()
      expect(session.phone).toBeTruthy()
      expect(session.s_date).toEqual('2022/01/22')
      expect(session.time_from).toBe('09:00:00')
      expect(session.time_to).toBe('10:00:00')
      expect(session.duration).toBe(60)
      expect(session.name).toBe('any_name')
      expect(session.email).toBe('any_email@example.com')
      expect(session.description).toBe('')
      expect(session.price).toBe(10000)
      expect(session.paid).toBe(false)
      expect(session.user_id).toBeFalsy()
      expect(session.image_path).toBeFalsy()
    })

    test('Should throw if Prisma queryRaw throw', async () => {
      const { sut, prisma } = makeSut()
      jest.spyOn(prisma, '$queryRaw').mockImplementationOnce(() => {
        throw new Error()
      })

      const sessionData = makeFakeSessionData()
      const promise = sut.add(sessionData)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('GetSessionRepository', () => {
    test('Should call find many on session with correct values', async () => {
      const { sut, prisma } = makeSut()
      const findManySpy = jest.spyOn(prisma.session, 'findMany')

      const sessionOptions = makeFakeSessionOptions()
      await sut.getPartial(sessionOptions)

      expect(findManySpy).toHaveBeenCalledWith(makeFindManyOptions())
    })

    test('Should return all partial sessions if no session options is passed', async () => {
      const { sut } = makeSut()

      const sessions = await sut.getPartial()
      expect(sessions).toEqual(makePartialSessions())
    })

    test('Should return partial sessions on success', async () => {
      const { sut } = makeSut()

      const sessionOptions = makeFakeSessionOptions()
      const sessions = await sut.getPartial(sessionOptions)

      expect(sessions).toEqual(makePartialSessions('2022/01/22'))
    })

    test('Should throw if Prisma findMany throw', async () => {
      const { sut, prisma } = makeSut()
      jest.spyOn(prisma.session, 'findMany').mockImplementationOnce(() => {
        throw new Error()
      })

      const sessionOptions = makeFakeSessionOptions()
      const promise = sut.getPartial(sessionOptions)

      await expect(promise).rejects.toThrow()
    })
  })
})
