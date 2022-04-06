import { CPFValidator } from '../../presentation/protocols/cpf-validator'
import validator from 'validator'

export class CPFValidatorAdapter implements CPFValidator {
  isValid (cpf: string): boolean {
    return validator.isTaxID(cpf, 'pt-BR')
  }
}
