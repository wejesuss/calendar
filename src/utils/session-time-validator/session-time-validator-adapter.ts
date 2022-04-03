import { SessionTimeValidator } from '../../presentation/protocols/session-time-validator'

export class SessionTimeValidatorAdapter implements SessionTimeValidator {
  isValid (sessionTime: string): boolean {
    if (typeof sessionTime !== 'string' || !sessionTime) return false

    const timeFormat = /^\d{2}:\d{2}(:\d{2})?$/
    return timeFormat.test(sessionTime)
  }
}
