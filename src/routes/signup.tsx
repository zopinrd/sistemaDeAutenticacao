import { createFileRoute } from '@tanstack/react-router'
import { SignUpForm } from '@/auth/components/signup-form'

export const Route = createFileRoute('/signup')({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-[400px] space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="text-muted-foreground">
            Preencha os campos abaixo para criar sua conta
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
