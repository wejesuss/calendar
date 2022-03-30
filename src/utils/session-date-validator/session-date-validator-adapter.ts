import { SessionDateValidator } from '../../presentation/protocols/session-date-validator'
import validator from 'validator'

export class SessionDateValidatorAdapter implements SessionDateValidator {
  isValid (sessionDate: string): boolean {
    if (!sessionDate || typeof sessionDate !== 'string') return false

    return validator.isDate(sessionDate, { delimiters: ['/'] })
  }
}
