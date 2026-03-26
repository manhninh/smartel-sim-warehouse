export type UserRole = 'ADMIN' | 'DEALER' | 'CUSTOMER'

export interface JwtUserPayload {
  sub: string
  username: string
  role: UserRole
}
