import * as z from 'zod'

const passwordRegex = {
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*]/
}

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
})

export const signUpSchema = z.object({
  email: z.string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  full_name: z.string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'O nome deve ter no mínimo 3 caracteres'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(passwordRegex.uppercase, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(passwordRegex.number, 'A senha deve conter pelo menos um número')
    .regex(passwordRegex.special, 'A senha deve conter pelo menos um caractere especial (!@#$%^&*)'),
  confirmPassword: z.string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
})

export const resetPasswordSchema = z.object({
  email: z.string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
