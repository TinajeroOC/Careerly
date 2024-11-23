'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export type UpdatePersonalInformationData = {
  firstName: string
  lastName: string
}

export async function updatePersonalInformation({
  firstName,
  lastName,
}: UpdatePersonalInformationData) {
  const supabase = await createClient()

  const { data: getUser, error: getUserError } = await supabase.auth.getUser()

  if (getUserError) throw getUserError

  const { error: updateUserError } = await supabase.auth.updateUser({
    data: {
      full_name: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
    },
  })

  if (updateUserError) throw updateUserError

  const { error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      first_name: firstName,
      last_name: lastName,
    })
    .eq('id', getUser.user?.id)

  if (updateProfileError) throw updateProfileError

  revalidatePath('/', 'layout')
}

export type UpdateProfileData = {
  headline?: string | null
  about?: string | null
}

export async function updateProfile({ headline, about }: UpdateProfileData) {
  const supabase = await createClient()

  const { data: getUser, error: getUserError } = await supabase.auth.getUser()

  if (getUserError) throw getUserError

  const { error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      headline,
      about,
    })
    .eq('id', getUser.user?.id)

  if (updateProfileError) throw updateProfileError

  revalidatePath('/', 'layout')
}
