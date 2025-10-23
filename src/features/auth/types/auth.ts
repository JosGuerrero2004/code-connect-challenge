export interface User {
  uid: string
  email: string | null
  displayName?: string | null
}
export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface UserProfile {
  uid: string
  username: string
  displayName: string
  email: string
  bio: string
  photoURL: string
  followers: number
  following: number
  createdAt: string
}
