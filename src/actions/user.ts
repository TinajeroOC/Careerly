'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export type UpdateProfileIntroData = {
  firstName: string
  lastName: string
  headline?: string
}

export async function updateProfileIntro({
  firstName,
  lastName,
  headline,
}: UpdateProfileIntroData) {
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

  const { data: updateProfile, error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      first_name: firstName,
      last_name: lastName,
      headline,
    })
    .eq('id', getUser.user?.id)
    .select()
    .single()

  if (updateProfileError) throw updateProfileError

  revalidatePath(`/ly/${updateProfile.vanity_url}`, 'page')
}

export type UpdateProfileAboutData = {
  about?: string
}

export async function updateProfileAbout({ about }: UpdateProfileAboutData) {
  const supabase = await createClient()

  const { data: getUser, error: getUserError } = await supabase.auth.getUser()

  if (getUserError) throw getUserError

  const { data: updateProfile, error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      about,
    })
    .eq('id', getUser.user?.id)
    .select()
    .single()

  if (updateProfileError) throw updateProfileError

  revalidatePath(`/ly/${updateProfile.vanity_url}`, 'page')
}

export type UpdateProfileContactInfoData = {
  publicEmail?: string
  publicPhoneNumber?: string
  publicWebsiteUrl?: string
}

export async function updateProfileContactInfo({
  publicEmail,
  publicPhoneNumber,
  publicWebsiteUrl,
}: UpdateProfileContactInfoData) {
  const supabase = await createClient()

  const { data: getUser, error: getUserError } = await supabase.auth.getUser()

  if (getUserError) throw getUserError

  const { data: updateProfile, error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      public_email: publicEmail,
      public_phone_number: publicPhoneNumber,
      public_website_url: publicWebsiteUrl,
    })
    .eq('id', getUser.user?.id)
    .select()
    .single()

  if (updateProfileError) throw updateProfileError

  revalidatePath(`/ly/${updateProfile.vanity_url}`, 'page')
}
