'use client'

import { useState } from 'react'

import { UpdateProfileForm } from '@/components/forms/UpdateProfileForm'
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

export function UpdateProfileModal() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant='outline' className='md:min-w-24'>
          Edit
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Profile</ModalTitle>
          <ModalDescription>Edit your public profile</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateProfileForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
