import { CreateTimeTo } from '../../presentation/protocols/create-time-to'
import { zeroPadder } from '../../shared/zero-pad/zero-pad'

export class CreateTimeToAdapter implements CreateTimeTo {
  create (timeFrom: string, duration: number): string {
    const [timeFromHours, timeFromMinutes] = timeFrom.split(':').map(Number)

    const overlappingMinutes = timeFromMinutes + duration
    const hoursToAdd = Math.trunc(overlappingMinutes / 60)
    const overlappingHours = timeFromHours + hoursToAdd
    const minutes = overlappingMinutes % 60
    const hours = overlappingHours % 24
    const timeTo = `${zeroPadder.pad(hours)}:${zeroPadder.pad(minutes)}`

    if (hours === 0 && minutes === 0) return timeTo
    if (timeFromHours > hours) return ''
    if (timeFromHours === hours && timeFromMinutes > minutes) return ''

    return timeTo
  }
}
