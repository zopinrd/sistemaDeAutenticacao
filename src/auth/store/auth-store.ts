import { create } from 'zustand'
import type { AuthStore } from '@/types/auth'

const initialState = {
  user: null,
  session: null,
  loading: true,
  error: null
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState)
}))
