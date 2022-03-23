import { PhoneValidatorAdapter } from './phone-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isMobilePhone (): boolean {
    return true
  }
}))

describe('PhoneValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new PhoneValidatorAdapter()
    jest.spyOn(validator, 'isMobilePhone').mockReturnValueOnce(false)

    const isValid = sut.isValid('99911111111')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = new PhoneValidatorAdapter()

    const isValid = sut.isValid('99911111111')
    expect(isValid).toBe(true)
  })
})
