import { CreateTimeTo } from '../../presentation/protocols/create-time-to'

export class CreateTimeToAdapter implements CreateTimeTo {
  zeroPad (num: number, places: number = 2): string {
    return String(num).padStart(places, '0')
  }

  create (timeFrom: string, duration: number): string {
    const [timeFromHours, timeFromMinutes] = timeFrom.split(':').map(Number)

    const overlappingMinutes = timeFromMinutes + duration
    const hoursToAdd = Math.trunc(overlappingMinutes / 60)
    const overlappingHours = timeFromHours + hoursToAdd
    const minutes = overlappingMinutes % 60
    const hours = overlappingHours % 24
    const timeTo = `${this.zeroPad(hours)}:${this.zeroPad(minutes)}`

    return timeTo
  }
}
