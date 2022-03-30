import { CPFValidatorAdapter } from './cpf-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isTaxID (cpf: string): boolean {
    return true
  }
}))

describe('CPFValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new CPFValidatorAdapter()
    jest.spyOn(validator, 'isTaxID').mockReturnValueOnce(false)

    const isValid = sut.isValid('11111111111')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = new CPFValidatorAdapter()

    const isValid = sut.isValid('11111111111')
    expect(isValid).toBe(true)
  })
})
