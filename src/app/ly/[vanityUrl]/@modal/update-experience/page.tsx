import { ManageProfileExperienceModal } from '@/components/modals/ManageProfileExperienceModal'
import { createClient } from '@/lib/supabase/server'

interface UpdateProfileExperiencePageProps {
  params: Promise<{ vanityUrl: string }>
}

export default async function UpdateProfileExperiencePage({
  params,
}: UpdateProfileExperiencePageProps) {
  const { vanityUrl } = await params

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, profile_experiences(*)')
    .eq('vanity_url', vanityUrl)
    .maybeSingle()

  if (!profile) throw new Error('No profile found')

  return <ManageProfileExperienceModal profile={profile} />
}
