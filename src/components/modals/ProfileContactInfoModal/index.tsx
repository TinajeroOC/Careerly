'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'

import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal'
import { DisplayField } from '@/components/ui/DisplayField'
import { Separator } from '@/components/ui/Separator'
import { Database } from '@/types/supabase'
import Link from 'next/link'
import { removeUrlProtocol } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Edit } from 'lucide-react'

interface ProfileContactInfoModalProps {
  profile: Database['public']['Tables']['profiles']['Row']
  isEditable?: boolean
}

export function ProfileContactInfoModal({ profile, isEditable }: ProfileContactInfoModalProps) {
  const router = useRouter()
  const params = useParams()

  return (
    <Modal open onOpenChange={router.back}>
      <ModalContent>
        <ModalHeader>
          <div className='flex items-center'>
            <ModalTitle className='flex-grow'>Contact Info</ModalTitle>
            {isEditable && <Link href={`/ly/${params.vanityUrl}/update-contact-info`}>
              <Button size='icon' variant='ghost'><Edit /></Button>
            </Link>}
          </div>
        </ModalHeader>
        <ModalBody className='gap-4 flex flex-col'>
          <DisplayField label='Profile' content={<Link href={`careerly.com/ly/${profile.vanity_url}`} className='font-light text-blue-500 hover:underline underline-offset-1'>{`careerly.com/ly/${profile.vanity_url}`}</Link>} />
          <Separator />
          <DisplayField label='Website' content={profile.public_website_url ? <Link href={profile.public_website_url} className='font-light text-blue-500 hover:underline underline-offset-1'>{removeUrlProtocol(profile.public_website_url)}</Link> : <span className='font-light'>None</span>} />
          <Separator />
          <DisplayField label='Email' content={<span className='font-light'>{profile.public_email || 'None'}</span>} />
          <Separator />
          <DisplayField label='Phone Number' content={<span className='font-light'>{profile.public_phone_number || 'None'}</span>} />
          <Separator />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
