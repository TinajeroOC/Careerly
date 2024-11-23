'use client'

import { useState } from 'react'

import { UpdatePersonalInformationForm } from '@/components/forms/UpdatePersonalInformationForm'
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

export function UpdatePersonalInformationModal() {
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
          <ModalTitle>Personal Information</ModalTitle>
          <ModalDescription>Edit your personal information</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdatePersonalInformationForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
