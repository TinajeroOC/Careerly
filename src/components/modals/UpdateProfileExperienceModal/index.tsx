'use client'

import { useRouter } from 'next/navigation'

import { UpdateProfileExperienceForm } from '@/components/forms/UpdateProfileExperienceForm'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal'

export function UpdateProfileExperienceModal() {
  const router = useRouter()

  return (
    <Modal open onOpenChange={router.back}>
      <ModalContent className='px-0 py-6'>
        <ModalHeader className='px-6'>
          <ModalTitle>Update Experience</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <UpdateProfileExperienceForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
