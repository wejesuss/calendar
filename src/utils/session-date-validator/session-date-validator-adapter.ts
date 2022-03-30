import { SessionDateValidator } from '../../presentation/protocols/session-date-validator'

export class SessionDateValidatorAdapter implements SessionDateValidator {
  isValid (sessionDate: string): boolean {
    if (typeof sessionDate !== 'string') return false
  }
}
