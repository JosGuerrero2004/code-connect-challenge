export interface User {
  uid: string
  email: string
  userProfile?: UserProfile | null
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
  photoURL: string | null
  followers: number
  following: number
  createdAt: string
}
