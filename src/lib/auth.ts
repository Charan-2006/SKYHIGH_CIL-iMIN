const AUTH_KEY = 'carboncortex_auth'

export interface AuthUser {
  name: string
  email: string
  role: string
  mine: string
}

export function getAuthUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null
}

export function setAuthUser(user: AuthUser): void {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function clearAuthUser(): void {
  sessionStorage.removeItem(AUTH_KEY)
}

export const defaultAuthUser: AuthUser = {
  name: 'Charan Annamalai A',
  email: 'charan.annamalai@coalindia.in',
  role: 'Administrator',
  mine: 'HQ Kolkata',
}
