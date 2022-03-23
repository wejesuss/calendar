import { PhoneValidator } from '../../presentation/protocols/phone-validator'
import validator from 'validator'

export class PhoneValidatorAdapter implements PhoneValidator {
  isValid (phone: string): boolean {
    return validator.isMobilePhone(phone, 'pt-BR')
  }
}
