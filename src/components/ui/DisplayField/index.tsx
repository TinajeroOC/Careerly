import { ReactNode } from 'react'

interface DisplayFieldProps {
  label: string
  content: ReactNode
}

export function DisplayField({ label, content }: DisplayFieldProps): JSX.Element {
  return (
    <div className='items-top flex flex-col justify-between gap-2 md:flex-row'>
      <div className='flex w-full flex-col'>
        <span className='mb-1 font-medium'>{label}</span>
        <div className='w-full'>{content}</div>
      </div>
    </div>
  )
}
