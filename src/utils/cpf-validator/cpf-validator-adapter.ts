import { CPFValidator } from '../../presentation/protocols/cpf-validator'

export class CPFValidatorAdapter implements CPFValidator {
  isValid (cpf: string): boolean {
    return false
  }
}
