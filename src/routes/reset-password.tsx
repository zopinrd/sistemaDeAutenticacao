import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordForm } from '@/auth/components/reset-password-form'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-[400px] space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Recuperar senha</h1>
          <p className="text-muted-foreground">
            Digite seu e-mail para receber um link de recuperação de senha
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
