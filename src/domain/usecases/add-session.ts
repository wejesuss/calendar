import { Session } from '../models/session'

export interface AddSessionModel {
  s_date: string
  time_from: string
  time_to: string
  duration: number
  name: string
  email: string
  cpf: string
  phone: string
  description: string
  user_id?: string
  price: number
}

export interface AddSession {
  add: (sessionData: AddSessionModel) => Promise<Session>
}
