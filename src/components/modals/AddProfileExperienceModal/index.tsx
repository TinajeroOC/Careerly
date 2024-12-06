'use client'

import { useRouter } from 'next/navigation'

import { AddProfileExperienceForm } from '@/components/forms/AddProfileExperienceForm'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal'

export function AddProfileExperienceModal() {
  const router = useRouter()

  return (
    <Modal open onOpenChange={router.back}>
      <ModalContent className='px-0 py-6'>
        <ModalHeader className='px-6'>
          <ModalTitle>Add Experience</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <AddProfileExperienceForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
