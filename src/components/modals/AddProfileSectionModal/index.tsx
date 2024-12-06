'use client'

import { LayoutPanelTop } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal'
import { Separator } from '@/components/ui/Separator'

export function AddProfileSectionModal() {
  const [open, setOpen] = useState<boolean>(false)
  const pathname = usePathname()

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button size='icon' variant='ghost'>
          <LayoutPanelTop />
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Add Section</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Accordion type='multiple' defaultValue={['core']}>
            <AccordionItem value='core'>
              <AccordionTrigger>Core</AccordionTrigger>
              <AccordionContent className='flex flex-col gap-4'>
                <Link
                  href={`${pathname}/update-about`}
                  onClick={() => setOpen(false)}
                  className='w-full'
                >
                  Add About
                </Link>
                <Separator />
                <Link
                  href={`${pathname}/update-contact-info`}
                  onClick={() => setOpen(false)}
                  className='w-full'
                >
                  Add Contact Info
                </Link>
                <Separator />
                <Link
                  href={`${pathname}/add-experience`}
                  onClick={() => setOpen(false)}
                  className='w-full'
                >
                  Add Experience
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
