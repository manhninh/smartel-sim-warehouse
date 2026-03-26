export type UserRole = 'ADMIN' | 'DEALER' | 'CUSTOMER'

export interface JwtUserPayload {
  sub: number
  username: string
  role: UserRole
}
