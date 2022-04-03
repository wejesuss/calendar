import { SessionTimeValidatorAdapter } from './session-time-validator-adapter'

interface SutTypes {
  sut: SessionTimeValidatorAdapter
}

const makeSut = (): SutTypes => {
  const sut = new SessionTimeValidatorAdapter()

  return { sut }
}

describe('SessionTimeValidator Adapter', () => {
  test('Should return false if session time is not a string', () => {
    const { sut } = makeSut()

    const isSessionTimeValid = sut.isValid(0 as any)

    expect(isSessionTimeValid).toBe(false)
  })

  test('Should return false if session time is empty string', () => {
    const { sut } = makeSut()

    const isSessionTimeValid = sut.isValid('')

    expect(isSessionTimeValid).toBe(false)
  })

  test('Should return false if session time is not correctly formatted', () => {
    const { sut } = makeSut()

    const isSessionTimeValid = sut.isValid('10-30') // 10:30

    expect(isSessionTimeValid).toBe(false)
  })

  test('Should return false if session time hour and minute is invalid', () => {
    const { sut } = makeSut()

    let isSessionTimeValid = sut.isValid('10:60')
    expect(isSessionTimeValid).toBe(false)

    isSessionTimeValid = sut.isValid('24:00')
    expect(isSessionTimeValid).toBe(false)

    isSessionTimeValid = sut.isValid('26:60')
    expect(isSessionTimeValid).toBe(false)
  })
})
