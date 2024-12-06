'use client'

import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import { deleteProfileExperience } from '@/actions/user'
import { Button } from '@/components/ui/Button'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal'
import { useToast } from '@/hooks/use-toast'

export function DeleteProfileExperienceModal() {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const handleDeleteExperience = async () => {
    try {
      setLoading(true)
      if (typeof params.experienceId !== 'string') throw new Error('Invalid parameters')
      await deleteProfileExperience(params.experienceId)
      router.back()
    } catch (error) {
      console.error(error)
      toast({
        title: 'There was an issue deleting the experience',
        description: 'Contact us if this issue persists',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant='ghost'>Delete</Button>
      </ModalTrigger>
      <ModalContent className='max-w-xl'>
        <ModalHeader>
          <ModalTitle>Delete Experience</ModalTitle>
          <ModalDescription>This action cannot be reversed</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='destructive' disabled={loading} onClick={handleDeleteExperience}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
