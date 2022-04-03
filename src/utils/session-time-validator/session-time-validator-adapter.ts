import { SessionTimeValidator } from '../../presentation/protocols/session-time-validator'

export class SessionTimeValidatorAdapter implements SessionTimeValidator {
  isValid (sessionTime: string): boolean {
    if (typeof sessionTime !== 'string' || !sessionTime) return false

    const timeFormat = /^\d{2}:\d{2}(:\d{2})?$/
    if (!timeFormat.test(sessionTime)) return false

    const [hours, minutes] = sessionTime.split(':').map(Number)

    const isValidHour = hours >= 0 && hours < 24
    const isValidMinute = minutes >= 0 && minutes < 60

    if (!isValidHour || !isValidMinute) return false

    return true
  }
}
