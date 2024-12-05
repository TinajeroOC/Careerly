import React, { ReactNode } from 'react'

interface DisplayFieldProps {
  label: string
  content: ReactNode
}

export function DisplayField({ label, content }: DisplayFieldProps): JSX.Element {
  return (
    <div className='items-top flex flex-col justify-between gap-2 md:flex-row'>
      <div className='flex w-full flex-col'>
        <span className='font-medium mb-1'>{label}</span>
        <div className='w-full'>{content}</div>
      </div>
    </div>
  )
}
