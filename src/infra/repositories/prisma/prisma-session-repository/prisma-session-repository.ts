import { AddSessionRepository } from '../../../../data/protocols/add-session-repository'
import { Session } from '../../../../domain/models/session'
import { AddSessionModel } from '../../../../domain/usecases/add-session'
import { PrismaClient } from '@prisma/client'

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

    await this.prisma.session.create({
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

    return null
  }
}