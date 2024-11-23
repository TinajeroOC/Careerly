import { UploadProfileBanner } from '@/components/forms/UploadProfileBanner'
import { UploadProfilePicture } from '@/components/forms/UploadProfilePicture'
import { SettingsSection } from '@/components/layout/SettingsSection'
import { UpdatePersonalInformationModal } from '@/components/modals/UpdatePersonalInformationModal'
import { UpdateProfileModal } from '@/components/modals/UpdateProfileModal'
import { DisplayField } from '@/components/ui/DisplayField'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: getUser, error: getUserError } = await supabase.auth.getUser()

  if (getUserError) throw getUserError

  const { data: getUserProfile, error: getUserProfileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', getUser.user?.id)

  if (getUserProfileError) throw getUserProfileError

  return (
    <div className='my-8 flex w-full flex-col px-4 md:px-8'>
      <main className='w-full'>
        <h1 className='mb-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0'>
          Settings
        </h1>
        <SettingsSection
          title='Personal Information'
          actionRow={<UpdatePersonalInformationModal />}
        >
          <DisplayField
            label='Name'
            description='Your name is visible to all users'
            content={<Input readOnly value={getUser.user.user_metadata.full_name} />}
          />
        </SettingsSection>
        <SettingsSection title='Profile' actionRow={<UpdateProfileModal />}>
          <DisplayField
            label='Picture & Banner'
            description='Upload a picture and banner'
            content={
              <div className='relative mb-10'>
                <UploadProfilePicture
                  userId={getUser.user.id}
                  url={getUser.user.user_metadata.picture_url}
                  className='absolute -bottom-12 left-6'
                />
                <UploadProfileBanner
                  userId={getUser.user.id}
                  url={getUser.user.user_metadata.banner_url}
                />
              </div>
            }
          />
          <DisplayField
            label='Headline'
            description='Highlight your role and focus'
            content={<Input readOnly value={getUserProfile[0].headline ?? undefined} />}
          />
          <DisplayField
            label='About'
            description='Summarize your background, skills, and achievements'
            content={
              <Textarea
                readOnly
                value={getUserProfile[0].about ?? undefined}
                className='min-h-40'
              />
            }
          />
        </SettingsSection>
      </main>
    </div>
  )
}
