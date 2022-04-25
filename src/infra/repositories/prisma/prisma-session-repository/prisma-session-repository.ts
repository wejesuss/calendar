import {
  Session,
  PartialSession,
  AddSessionRepository,
  AddSessionModel,
  GetSessionRepository,
  GetSessionOptions,
  PrismaClient,
  Prisma
} from './prisma-session-repository-protocols'

export class PrismaSessionRepository implements AddSessionRepository, GetSessionRepository {
  constructor (private readonly prisma: PrismaClient) {
  }

  zeroPad (num: number, places: number = 2): string {
    return String(num).padStart(places, '0')
  }

  mapSession (session: {
    duration: number
    sDate: Date
    timeFrom: Date
    timeTo: Date
  }): PartialSession {
    const sDate = `${this.zeroPad(session.sDate.getUTCFullYear())}/${this.zeroPad(session.sDate.getUTCMonth() + 1)}/${this.zeroPad(session.sDate.getUTCDate())}`
    const timeFrom = `${this.zeroPad(session.timeFrom.getUTCHours())}:${this.zeroPad(session.timeFrom.getUTCMinutes())}`
    const timeTo = `${this.zeroPad(session.timeTo.getUTCHours())}:${this.zeroPad(session.timeTo.getUTCMinutes())}`

    return {
      duration: session.duration,
      s_date: sDate,
      time_from: timeFrom,
      time_to: timeTo
    }
  }

  createInsertionQuery (sessionData: AddSessionModel): Prisma.Sql {
    const {
      name, cpf, description, duration, email, phone, price,
      s_date: sDate,
      time_from: timeFrom,
      time_to: timeTo,
      user_id: userId
    } = sessionData

    const dateFrom = new Date(`${sDate} ${timeFrom} GMT-00`)
    const dateTo = new Date(`${sDate} ${timeTo} GMT-00`)

    const cpfEncrypted = Prisma.sql`pgp_sym_encrypt(${cpf}, ${process.env.CALENDAR_PG_ENCRYPTION_KEY})`
    const phoneEncrypted = Prisma.sql`pgp_sym_encrypt(${phone}, ${process.env.CALENDAR_PG_ENCRYPTION_KEY})`
    const id = Prisma.sql`gen_random_uuid()`

    return Prisma.sql`INSERT INTO session (id,name,email,cpf,phone,description,duration,s_date,time_from,time_to,price,user_id) VALUES (${id},${name},${email},${cpfEncrypted},${phoneEncrypted},${description},${duration},${dateFrom},${dateFrom},${dateTo},${price},${userId}) RETURNING *;`
  }

  async add (sessionData: AddSessionModel): Promise<Session> {
    const {
      name, cpf, description, duration, email, phone, price,
      user_id: userId
    } = sessionData

    const sql = this.createInsertionQuery(sessionData)
    const [session] = await this.prisma.$queryRaw<Session[]>(sql)

    return {
      id: session.id,
      name,
      email,
      cpf,
      phone,
      description,
      duration,
      s_date: session.s_date.split('-').join('/'),
      time_from: session.time_from,
      time_to: session.time_to,
      price,
      paid: session.paid,
      user_id: userId,
      image_path: session.image_path,
      created_at: session.created_at,
      updated_at: session.updated_at
    }
  }

  async getPartial (sessionOptions?: GetSessionOptions): Promise<PartialSession[]> {
    const { date, month, year } = sessionOptions

    const dateToMatch = new Date(Date.UTC(year, month - 1, date))

    const sessions = await this.prisma.session.findMany({
      select: { duration: true, sDate: true, timeFrom: true, timeTo: true },
      where: { sDate: { equals: dateToMatch } },
      orderBy: { timeFrom: 'asc' }
    })

    const mappedToPartialSessions = sessions.map((session) => {
      return this.mapSession(session)
    })

    return mappedToPartialSessions
  }
}
