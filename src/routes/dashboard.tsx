import { createFileRoute } from '@tanstack/react-router'
import { PrivateRoute } from '@/auth/components/private-route'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <PrivateRoute>
      <div className="container py-8">
        <div className="rounded-lg border bg-card p-8 text-card-foreground shadow">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Esta é uma rota protegida. Você só pode ver isso se estiver autenticado.
          </p>
        </div>
      </div>
    </PrivateRoute>
  )
}
