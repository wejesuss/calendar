import { PhoneValidatorAdapter } from './phone-validator-adapter'

describe('PhoneValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new PhoneValidatorAdapter()

    const isValid = sut.isValid('99911111111')
    expect(isValid).toBe(false)
  })
})
