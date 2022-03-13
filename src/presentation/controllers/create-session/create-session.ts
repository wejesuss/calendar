import { TimeInterval } from '../../../domain/models/schedule'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  GetSchedule,
  CreateTimeTo,
  EmailValidator,
  PhoneValidator,
  CPFValidator,
  SessionDateValidator,
  SessionTimeValidator,
  MissingParamError,
  InvalidParamError,
  internalServerError,
  ServerError,
  badRequest
} from './create-session-protocols'

export class CreateSessionController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly phoneValidator: PhoneValidator
  private readonly cpfValidator: CPFValidator
  private readonly sessionDateValidator: SessionDateValidator
  private readonly sessionTimeValidator: SessionTimeValidator
  private readonly getSchedule: GetSchedule
  private readonly createTimeTo: CreateTimeTo

  constructor (
    emailValidator: EmailValidator,
    phoneValidator: PhoneValidator,
    cpfValidator: CPFValidator,
    sessionDateValidator: SessionDateValidator,
    sessionTimeValidator: SessionTimeValidator,
    getSchedule: GetSchedule,
    createTimeTo: CreateTimeTo
  ) {
    this.emailValidator = emailValidator
    this.phoneValidator = phoneValidator
    this.cpfValidator = cpfValidator
    this.sessionDateValidator = sessionDateValidator
    this.sessionTimeValidator = sessionTimeValidator
    this.getSchedule = getSchedule
    this.createTimeTo = createTimeTo
  }

  normalizeTime (value: string, index: number): number {
    let valueNumber = Number(value)

    if (valueNumber === 0 && index === 0) valueNumber = 24

    return valueNumber
  }

  validateTimeInterval (sessionTimeInterval: TimeInterval, scheduleTimeInterval: TimeInterval): boolean {
    const [sessionTimeFromHours, sessionTimeFromMinutes] = sessionTimeInterval.time_from.split(':').map(Number)
    const [sessionTimeToHours, sessionTimeToMinutes] = sessionTimeInterval.time_to.split(':').map(this.normalizeTime)
    const [timeFromHours, timeFromMinutes] = scheduleTimeInterval.time_from.split(':').map(Number)
    const [timeToHours, timeToMinutes] = scheduleTimeInterval.time_to.split(':').map(this.normalizeTime)

    if (sessionTimeFromHours < timeFromHours) {
      return false
    }

    if (sessionTimeFromHours === timeFromHours) {
      if (sessionTimeFromMinutes < timeFromMinutes) {
        return false
      }
    }

    if (sessionTimeToHours > timeToHours) {
      return false
    }

    if (sessionTimeToHours === timeToHours) {
      if (sessionTimeToMinutes > timeToMinutes) {
        return false
      }
    }

    return true
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, phone, cpf, session_date: sessionDate, session_time: sessionTime } = httpRequest.body

      const requiredFields = ['name', 'email', 'phone', 'cpf', 'description', 'session_date', 'session_time']
      const stringRequiredFields = ['name', 'description']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      for (const field of stringRequiredFields) {
        if (typeof httpRequest.body[field] !== 'string') {
          return badRequest(new InvalidParamError(field))
        }
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const isPhoneValid = this.phoneValidator.isValid(phone)
      if (!isPhoneValid) {
        return badRequest(new InvalidParamError('phone'))
      }

      const isCPFValid = this.cpfValidator.isValid(cpf)
      if (!isCPFValid) {
        return badRequest(new InvalidParamError('cpf'))
      }

      const isDateValid = this.sessionDateValidator.isValid(sessionDate)
      if (!isDateValid) {
        return badRequest(new InvalidParamError('session_date'))
      }

      const isTimeValid = this.sessionTimeValidator.isValid(sessionTime)
      if (!isTimeValid) {
        return badRequest(new InvalidParamError('session_time'))
      }

      const [sDateYear, sDateMonth, sDateDay] = (sessionDate as string).split('/').map(Number)
      const sDate = new Date(sDateYear, sDateMonth, sDateDay)
      const weekDay = sDate.getDay()

      const partialSchedule = await this.getSchedule.getPartial({ weekDay, year: sDateYear, month: sDateMonth, date: sDateDay })

      const timeFrom = sessionTime as string
      const timeTo = this.createTimeTo.create(timeFrom, partialSchedule.duration)

      const today = Date.now()
      const sDateTime = sDate.getTime()
      const dayInMs = 24 * 60 * 60 * 1000
      const daysToFuture = (partialSchedule.activation_interval * partialSchedule.activation_interval_type) * dayInMs
      if (sDateTime <= today || sDateTime > (today + daysToFuture)) {
        return badRequest(new InvalidParamError('session_date'))
      }

      const isReplacementAvailable = partialSchedule.replacements.every((replacement): boolean => {
        const { date, time_from: rTimeFrom, time_to: rTimeTo } = replacement

        if (date === sessionDate) {
          const sessionTimeInterval: TimeInterval = {
            time_from: timeFrom,
            time_to: timeTo
          }
          const scheduleTimeInterval: TimeInterval = {
            time_from: rTimeFrom,
            time_to: rTimeTo
          }

          return this.validateTimeInterval(sessionTimeInterval, scheduleTimeInterval)
        }

        return true
      })

      if (!isReplacementAvailable) {
        return badRequest(new InvalidParamError('session_time'))
      }

      const isScheduleAvailable = partialSchedule.availability.some((scheduleTimeInterval): boolean => {
        const sessionTimeInterval: TimeInterval = {
          time_from: timeFrom,
          time_to: timeTo
        }

        return this.validateTimeInterval(sessionTimeInterval, scheduleTimeInterval)
      })

      if (!isScheduleAvailable) {
        return badRequest(new InvalidParamError('session_time'))
      }
    } catch (error) {
      return internalServerError(new ServerError(error.stack))
    }
  }
}
