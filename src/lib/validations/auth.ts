import { z } from 'zod'

export const signUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6, { message: 'Password must contain at least 6 character(s)' }),
})

export type SignUpInput = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type SignInInput = z.infer<typeof signInSchema>
