'use client'

import { useRouter } from 'next/navigation'

import { UpdateProfileAboutForm } from '@/components/forms/UpdateProfileAboutForm'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal'

export function UpdateProfileAboutModal() {
  const router = useRouter()

  return (
    <Modal open onOpenChange={router.back}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit About</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <UpdateProfileAboutForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
