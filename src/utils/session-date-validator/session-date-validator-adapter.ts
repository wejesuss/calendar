import { SessionDateValidator } from '../../presentation/protocols/session-date-validator'
import validator from 'validator'

export type SessionDateValidatorOptions = validator.IsDateOptions

export class SessionDateValidatorAdapter implements SessionDateValidator {
  constructor (private readonly options: SessionDateValidatorOptions) { }

  isValid (sessionDate: string): boolean {
    if (!sessionDate || typeof sessionDate !== 'string') return false

    return validator.isDate(sessionDate, this.options)
  }
}
