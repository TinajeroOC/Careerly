import { ProfileContactInfoModal } from '@/components/modals/ProfileContactInfoModal'
import { createClient } from '@/lib/supabase/server'

interface ProfileContactInfoPageProps {
  params: Promise<{ vanityUrl: string }>
}

export default async function ProfileContactInfoPage({ params }: ProfileContactInfoPageProps) {
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

  return <ProfileContactInfoModal profile={profile} isEditable={isProfileOwner} />
}
