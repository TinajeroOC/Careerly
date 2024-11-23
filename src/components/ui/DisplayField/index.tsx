import React, { ReactNode } from 'react'

interface DisplayFieldProps {
  label: string
  description?: string
  content: ReactNode
}

export function DisplayField({ label, description, content }: DisplayFieldProps): JSX.Element {
  return (
    <div className='items-top flex flex-col justify-between gap-2 md:flex-row'>
      <div className='flex w-full flex-col'>
        <span className='font-medium'>{label}</span>
        {description && (
          <span className='text-sm font-light text-muted-foreground'>{description}</span>
        )}
      </div>
      <div className='w-full'>{content}</div>
    </div>
  )
}
