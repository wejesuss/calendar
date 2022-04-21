import { AddSessionRepository, Session, AddSessionModel, PrismaClient } from './prisma-session-repository-protocols'

export class PrismaSessionRepository implements AddSessionRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async add (sessionData: AddSessionModel): Promise<Session> {
    const {
      name, cpf, description, duration, email, phone, price,
      s_date: sDate,
      time_from: timeFrom,
      time_to: timeTo,
      user_id: userId
    } = sessionData

    const dateFrom = new Date(`${sDate} ${timeFrom}`)
    const dateTo = new Date(`${sDate} ${timeTo}`)

    const session = await this.prisma.session.create({
      data: {
        name: name,
        email: email,
        cpf: cpf, // needs encryption
        phone: phone, // needs encryption
        description: description,
        duration: duration,
        sDate: dateFrom,
        timeFrom: dateFrom,
        timeTo: dateTo,
        price: price,
        userId: userId
      }
    })

    return {
      id: session.id,
      name,
      email,
      cpf,
      phone,
      description,
      duration,
      s_date: sDate.split('-').join('/'),
      time_from: timeFrom,
      time_to: timeTo,
      price,
      paid: session.paid,
      user_id: userId,
      image_path: session.imagePath,
      created_at: session.createdAt.getTime(),
      updated_at: session.updatedAt.getTime()
    }
  }
}
