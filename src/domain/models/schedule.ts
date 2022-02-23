export interface TimeInterval {
  time_from: number
  time_to: number
}

export interface Replacement {
  date: number
  time_from: number
  time_to: number
}

export interface Schedule {
  id: number
  duration: number
  activation_interval: number
  activation_interval_type: number
  availability_0: TimeInterval[]
  availability_1: TimeInterval[]
  availability_2: TimeInterval[]
  availability_3: TimeInterval[]
  availability_4: TimeInterval[]
  availability_5: TimeInterval[]
  availability_6: TimeInterval[]
  replacements: Replacement[]
  created_at: number
}
