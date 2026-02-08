export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'WORKER'
}

export interface Product {
  id: string
  name: string
  quantity: number
  unit: string
  price: number
}
