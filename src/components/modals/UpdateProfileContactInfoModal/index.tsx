'use client'

import { useRouter } from 'next/navigation'

import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal'
import { UpdateProfileContactInfoForm } from '@/components/forms/UpdateProfileContactInfoForm'

export function UpdateProfileContactInfoModal() {
  const router = useRouter()

  return (
    <Modal open onOpenChange={router.back}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit Contact Info</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <UpdateProfileContactInfoForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
