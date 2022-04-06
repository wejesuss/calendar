import { CreateTimeToAdapter } from './create-time-to'

describe('CreateTimeTo Adapter', () => {
  test('Should return time to using duration and time from', () => {
    const sut = new CreateTimeToAdapter()

    let timeTo = sut.create('09:30', 15)
    expect(timeTo).toBe('09:45')

    timeTo = sut.create('09:50', 15)
    expect(timeTo).toBe('10:05')

    timeTo = sut.create('23:00', 60)
    expect(timeTo).toBe('00:00')

    timeTo = sut.create('23:59', 1)
    expect(timeTo).toBe('00:00')
  })

  test('Should return empty string if time to is less than time from', () => {
    const sut = new CreateTimeToAdapter()

    let timeTo = sut.create('22:00', 145)
    expect(timeTo).toBe('') // 00:25

    timeTo = sut.create('23:00', 145)
    expect(timeTo).toBe('') // 01:25
  })
})
