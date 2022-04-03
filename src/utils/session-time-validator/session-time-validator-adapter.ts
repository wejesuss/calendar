import { SessionTimeValidator } from '../../presentation/protocols/session-time-validator'

export class SessionTimeValidatorAdapter implements SessionTimeValidator {
  isValid (sessionTime: string): boolean {
    if (typeof sessionTime !== 'string') return false
  }
}
