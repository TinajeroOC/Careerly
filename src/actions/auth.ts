'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { generateRandomNumbers } from '@/lib/utils'
import { SignInInput, signInSchema, SignUpInput, signUpSchema } from '@/lib/validations/auth'

export async function signUp(data: SignUpInput) {
  const { firstName, lastName, email, password } = signUpSchema.parse(data)

  const supabase = await createClient()

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        vanity_url: `${firstName}-${lastName}-${generateRandomNumbers()}`.toLowerCase(),
      },
    },
  })

  if (signUpError) throw signUpError

  revalidatePath('/', 'layout')
  redirect('/signin')
}

export async function signIn(data: SignInInput) {
  const { email, password } = signInSchema.parse(data)

  const supabase = await createClient()

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) throw signInError

  revalidatePath('/', 'layout')
  redirect('/')
}
