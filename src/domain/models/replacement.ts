export interface Replacement {
  id: number
  date: string
  time_from: string
  time_to: string
  created_at: number
  updated_at: number
}

export type ReplacementDTO = Pick<Replacement, 'date'|'time_from'|'time_to'>
