import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/auth/components/login-form'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-[400px] space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="text-muted-foreground">
            Entre com seu email e senha para acessar sua conta
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
