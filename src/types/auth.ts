import { type User, type Session } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email: string
  username: string | null
  full_name: string | null
  bio: string | null
  website: string | null
  avatar_url: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser extends User {
  profile?: Profile
}

export interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  error: Error | null
}

export interface AuthContextType extends AuthState {
  signIn: (params: SignInParams) => Promise<void>
  signUp: (params: SignUpParams) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<void>
}

export interface SignInParams {
  email: string
  password: string
}

export interface SignUpParams extends SignInParams {
  full_name: string
}

export interface AuthStore extends AuthState {
  setUser: (user: AuthUser | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
  reset: () => void
}
