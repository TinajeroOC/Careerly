'use client'

import { format, formatDistanceStrict } from 'date-fns'
import { LayoutPanelTop } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment } from 'react'

import { Button } from '@/components/ui/Button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Separator } from '@/components/ui/Separator'
import { Database } from '@/types/supabase'

interface ManageProfileExperienceModalProps {
  profile: Database['public']['Tables']['profiles']['Row'] & {
    profile_experiences: Database['public']['Tables']['profile_experiences']['Row'][]
  }
}

export function ManageProfileExperienceModal({ profile }: ManageProfileExperienceModalProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Modal open onOpenChange={router.back}>
      <ModalTrigger asChild>
        <Button size='icon' variant='ghost'>
          <LayoutPanelTop />
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Update Experience</ModalTitle>
          <ModalDescription>Select an experience</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <ScrollArea className='max-h-[448px]'>
            <div className='flex flex-col gap-4'>
              {profile.profile_experiences
                .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
                .map((experience) => (
                  <Fragment key={experience.id}>
                    <Link href={`${pathname}/${experience.id}`} scroll={false}>
                      <div className='mb-2 flex flex-col gap-1'>
                        <span className='text-lg font-semibold'>{experience.title}</span>
                        <span className='font-medium'>
                          <span>{experience.company_name}</span>
                          <span className='px-2'>·</span>
                          <span>{experience.employment_type}</span>
                        </span>
                        <span className='text-sm font-light'>
                          <span>{format(experience.start_date, 'MMM yyyy')}</span>
                          <span className='px-2'>-</span>
                          <span>
                            {experience.end_date
                              ? format(experience.end_date, 'MMM yyyy')
                              : 'Present'}
                          </span>
                          <span className='px-2'>·</span>
                          <span>
                            {formatDistanceStrict(
                              experience.start_date,
                              experience.end_date ? experience.end_date : Date.now()
                            )}
                          </span>
                        </span>
                        <span className='text-sm font-light'>
                          <span className='text-sm font-light'>{experience.location}</span>
                          <span className='px-2'>·</span>
                          <span className='text-sm font-light'>{experience.location_type}</span>
                        </span>
                      </div>
                    </Link>
                    <Separator />
                  </Fragment>
                ))}
            </div>
          </ScrollArea>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
