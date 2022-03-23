import { CPFValidatorAdapter } from './cpf-validator-adapter'

describe('CPFValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new CPFValidatorAdapter()

    const isValid = sut.isValid('11111111111')
    expect(isValid).toBe(false)
  })
})
