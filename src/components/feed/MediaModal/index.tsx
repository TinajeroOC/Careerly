/* eslint-disable @next/next/no-img-element */
'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface MediaModalProps {
  url: string
  type: 'image' | 'video'
  isOpen: boolean
  onClose: () => void
}

export function MediaModal({ url, type, isOpen, onClose }: MediaModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'
      onClick={onClose}
    >
      <button
        className='absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70'
        onClick={onClose}
      >
        <X className='h-6 w-6' />
      </button>
      <div className='max-h-[90vh] max-w-[90vw] overflow-auto' onClick={(e) => e.stopPropagation()}>
        {type === 'image' ? (
          <img
            src={url}
            alt=''
            className='h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain'
          />
        ) : (
          <video src={url} controls className='h-auto max-h-[90vh] w-auto max-w-[90vw]' />
        )}
      </div>
    </div>
  )
}
