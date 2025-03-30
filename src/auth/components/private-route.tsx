import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '../context/auth-context'
import type { ReactNode } from 'react'

interface PrivateRouteProps {
  children: ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: '/login',
        replace: true,
        search: { redirect: window.location.pathname }
      })
    }
  }, [user, loading, navigate])

  if (loading || (!user && typeof window !== 'undefined')) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
