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
              <AccordionContent>
                <Link
                  href={`${pathname}/update-about`}
                  onClick={() => setOpen(false)}
                  className='w-full'
                >
                  Add About
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
