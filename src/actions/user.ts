'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import {
  ProfileAboutInput,
  profileAboutSchema,
  ProfileContactInfoInput,
  profileContactInfoSchema,
  ProfileExperienceInput,
  profileExperienceSchema,
  ProfileIntroInput,
  profileIntroSchema,
} from '@/lib/validations/user'

export async function updateProfileIntro(data: ProfileIntroInput) {
  const { firstName, lastName, headline } = profileIntroSchema.parse(data)

  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) throw userError

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
    .eq('id', user.user?.id)
    .select()
    .single()

  if (updateProfileError) throw updateProfileError

  revalidatePath(`/ly/${updateProfile.vanity_url}`, 'page')
}

export async function updateProfileAbout(data: ProfileAboutInput) {
  const { about } = profileAboutSchema.parse(data)

  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) throw userError

  const { data: updateProfile, error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      about,
    })
    .eq('id', user.user?.id)
    .select()
    .single()

  if (updateProfileError) throw updateProfileError

  revalidatePath(`/ly/${updateProfile.vanity_url}`, 'page')
}

export async function updateProfileContactInfo(data: ProfileContactInfoInput) {
  const { publicEmail, publicPhoneNumber, publicWebsiteUrl } = profileContactInfoSchema.parse(data)

  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) throw userError

  const { data: updateProfile, error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      public_email: publicEmail,
      public_phone_number: publicPhoneNumber,
      public_website_url: publicWebsiteUrl,
    })
    .eq('id', user.user?.id)
    .select()
    .single()

  if (updateProfileError) throw updateProfileError

  revalidatePath(`/ly/${updateProfile.vanity_url}`, 'page')
}

export async function addProfileExperience(data: ProfileExperienceInput) {
  const {
    companyName,
    employmentType,
    location,
    locationType,
    activeRole,
    startDate,
    endDate,
    title,
    description,
  } = profileExperienceSchema.parse(data)

  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) throw userError

  const { data: profile, error: getUserProfileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.user?.id)
    .single()

  if (getUserProfileError) throw getUserProfileError

  const { error: insertProfileExperienceError } = await supabase
    .from('profile_experiences')
    .insert({
      user_id: user.user.id,
      company_name: companyName,
      employment_type: employmentType,
      location,
      location_type: locationType,
      active_role: activeRole,
      start_date: startDate.from.toISOString(),
      end_date: activeRole ? null : endDate.from.toISOString(),
      title,
      description,
    })

  if (insertProfileExperienceError) throw insertProfileExperienceError

  revalidatePath(`/ly/${profile?.vanity_url}`, 'page')
}

export async function updateProfileExperience(id: string, data: ProfileExperienceInput) {
  const {
    companyName,
    employmentType,
    location,
    locationType,
    activeRole,
    startDate,
    endDate,
    title,
    description,
  } = profileExperienceSchema.parse(data)

  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) throw userError

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.user?.id)
    .single()

  if (profileError) throw profileError

  const { error: profileExperienceError } = await supabase
    .from('profile_experiences')
    .update({
      company_name: companyName,
      employment_type: employmentType,
      location,
      location_type: locationType,
      active_role: activeRole,
      start_date: startDate.from.toISOString(),
      end_date: endDate.from.toISOString(),
      title,
      description,
    })
    .eq('id', id)

  if (profileExperienceError) throw profileExperienceError

  revalidatePath(`/ly/${profile?.vanity_url}`, 'page')
}

export async function deleteProfileExperience(id: string) {
  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) throw userError

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.user?.id)
    .single()

  if (profileError) throw profileError

  const { error: profileExperienceError } = await supabase
    .from('profile_experiences')
    .delete()
    .eq('id', id)

  if (profileExperienceError) throw profileExperienceError

  revalidatePath(`/ly/${profile?.vanity_url}`, 'page')
}
