'use client'

import { useRouter } from 'next/navigation'

import { UpdateProfileIntroForm } from '@/components/forms/UpdateProfileIntroForm'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal'

export function UpdateProfileIntroModal() {
  const router = useRouter()

  return (
    <Modal open onOpenChange={router.back}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit Intro</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <UpdateProfileIntroForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
