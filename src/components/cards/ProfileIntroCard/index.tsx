'use client'

import { Edit } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { UploadProfileBanner } from '@/components/forms/UploadProfileBanner'
import { UploadProfilePicture } from '@/components/forms/UploadProfilePicture'
import { AddProfileSectionModal } from '@/components/modals/AddProfileSectionModal'
import { Button } from '@/components/ui/Button'
import { Database } from '@/types/supabase'

interface ProfileIntroCardProps {
  profile: Database['public']['Tables']['profiles']['Row']
  isEditable?: boolean
}

export function ProfileIntroCard({ profile, isEditable }: ProfileIntroCardProps) {
  const pathname = usePathname()

  return (
    <div className='rounded-lg border bg-card shadow-sm'>
      <div className='relative'>
        <UploadProfilePicture
          userId={profile.id}
          url={profile.picture_url}
          className='absolute -bottom-10 left-4 md:-bottom-12 md:left-8'
          disabled={!isEditable}
        />
        <UploadProfileBanner userId={profile.id} url={profile.banner_url} disabled={!isEditable} />
      </div>
      <div className='mt-2 flex min-h-8 justify-end gap-2 px-4 md:px-6'>
        {isEditable && (
          <>
            <AddProfileSectionModal />
            <Link href={`${pathname}/update-intro`} scroll={false}>
              <Button size='icon' variant='ghost'>
                <Edit />
              </Button>
            </Link>
          </>
        )}
      </div>
      <div className='mt-2 px-4 pb-4 md:mt-4 md:px-6 md:pb-6'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          {profile.first_name} {profile.last_name}
        </h1>
        <h2 className='text-base font-light'>{profile.headline}</h2>
        <Link
          href={`${pathname}/contact-info`}
          scroll={false}
          className='font-medium text-blue-500 underline-offset-1 hover:underline'
        >
          Contact Info
        </Link>
      </div>
    </div>
  )
}
