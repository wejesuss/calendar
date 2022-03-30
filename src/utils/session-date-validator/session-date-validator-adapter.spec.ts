import { SessionDateValidatorAdapter } from './session-date-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isDate (str: string, options: validator.IsDateOptions): boolean {
    return true
  }
}))

interface SutTypes {
  sut: SessionDateValidatorAdapter
}

const makeSut = (): SutTypes => {
  const sut = new SessionDateValidatorAdapter()

  return { sut }
}

describe('SessionDateValidator Adapter', () => {
  test('Should return false if session date is not a string', () => {
    const { sut } = makeSut()

    const isSessionDateValid = sut.isValid(0 as any)

    expect(isSessionDateValid).toBe(false)
  })

  test('Should return false if session date is empty string', () => {
    const { sut } = makeSut()

    const isSessionDateValid = sut.isValid('')

    expect(isSessionDateValid).toBe(false)
  })

  test('Should return false if validator returns false', () => {
    const { sut } = makeSut()
    jest.spyOn(validator, 'isDate').mockReturnValueOnce(false)

    const isSessionDateValid = sut.isValid('2022.03.30')

    expect(isSessionDateValid).toBe(false)
  })

  test('Should call validator with correct date and options', () => {
    const { sut } = makeSut()
    const isDateSpy = jest.spyOn(validator, 'isDate')

    sut.isValid('2022.03.30')

    expect(isDateSpy).toHaveBeenCalledWith('2022.03.30', { delimiters: ['/'] })
  })
})
