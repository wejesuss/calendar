import { SessionDateValidatorAdapter } from './session-date-validator-adapter'

describe('SessionDateValidator Adapter', () => {
  test('Should return false if session date is not a string', () => {
    const sut = new SessionDateValidatorAdapter()

    const isSessionDateValid = sut.isValid(0 as any)

    expect(isSessionDateValid).toBe(false)
  })
})
