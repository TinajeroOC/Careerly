import { ProfileAboutCard } from '@/components/cards/ProfileAboutCard'
import { ProfileIntroCard } from '@/components/cards/ProfileIntroCard'
import { createClient } from '@/lib/supabase/server'

interface ProfilePageProps {
  params: Promise<{ vanityUrl: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { vanityUrl } = await params

  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('vanity_url', vanityUrl)
    .maybeSingle()

  if (!profile) throw new Error('No profile found')

  const isProfileOwner = user.user?.id === profile.id

  return (
    <main className='my-8 flex w-full flex-col gap-4 px-4 md:px-8'>
      <ProfileIntroCard profile={profile} isEditable={isProfileOwner} />
      {profile.about && <ProfileAboutCard profile={profile} isEditable={isProfileOwner} />}
    </main>
  )
}
