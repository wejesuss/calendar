export interface Session {
  id: string
  s_date: string
  time_from: string
  time_to: string
  duration: number
  name: string
  email: string
  cpf: string
  phone: string
  description: string
  image_path: string
  price: number
  paid: boolean
  user_id: string
  created_at: number
  updated_at: number
}
