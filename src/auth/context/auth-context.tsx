import { createContext, useContext, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '../store/auth-store'
import type { AuthContextType, SignInParams, SignUpParams, Profile } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, session, loading, error, setUser, setSession, setLoading, setError } = useAuthStore()

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async ({ email, password }: SignInParams) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      toast.success('Login realizado com sucesso!')
    } catch (error) {
      setError(error as Error)
      toast.error('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async ({ email, password, full_name }: SignUpParams) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name },
        },
      })
      if (error) throw error
      
      toast.success('Conta criada com sucesso! Verifique seu e-mail.')
    } catch (error) {
      setError(error as Error)
      toast.error('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      setError(error as Error)
      toast.error('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      toast.success('E-mail de recuperação enviado!')
    } catch (error) {
      setError(error as Error)
      toast.error('Erro ao enviar e-mail de recuperação')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profile: Partial<Profile>) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user?.id)
      if (error) throw error
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      setError(error as Error)
      toast.error('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
