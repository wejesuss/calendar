import { zeroPadder } from './zero-pad'

describe('Zero Pad', () => {
  test('Should pad a number with a given number of zeros', () => {
    const sut = zeroPadder

    let padded = sut.pad(10, 5)
    expect(padded).toBe('00010')

    padded = sut.pad(9)
    expect(padded).toBe('09')

    padded = sut.pad(1, 1)
    expect(padded).toBe('1')
  })
})
