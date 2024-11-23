'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export type SignUpData = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export async function signUp({ firstName, lastName, email, password }: SignUpData) {
  const supabase = await createClient()

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (signUpError) throw signUpError

  revalidatePath('/', 'layout')
  redirect('/signin')
}

export type SignInData = {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInData) {
  const supabase = await createClient()

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) throw signInError

  revalidatePath('/', 'layout')
  redirect('/')
}
