import { SessionDateValidatorAdapter } from './session-date-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isDate (str: string, options: validator.IsDateOptions): boolean {
    return true
  }
}))

describe('SessionDateValidator Adapter', () => {
  test('Should return false if session date is not a string', () => {
    const sut = new SessionDateValidatorAdapter()

    const isSessionDateValid = sut.isValid(0 as any)

    expect(isSessionDateValid).toBe(false)
  })

  test('Should return false if session date is empty string', () => {
    const sut = new SessionDateValidatorAdapter()

    const isSessionDateValid = sut.isValid('')

    expect(isSessionDateValid).toBe(false)
  })

  test('Should return false if validator returns false', () => {
    const sut = new SessionDateValidatorAdapter()
    jest.spyOn(validator, 'isDate').mockReturnValueOnce(false)

    const isSessionDateValid = sut.isValid('2022.03.30')

    expect(isSessionDateValid).toBe(false)
  })

  test('Should call validator with correct date and options', () => {
    const sut = new SessionDateValidatorAdapter()
    const isDateSpy = jest.spyOn(validator, 'isDate')

    sut.isValid('2022.03.30')

    expect(isDateSpy).toHaveBeenCalledWith('2022.03.30', { delimiters: ['/'] })
  })
})
