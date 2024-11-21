import { siteConfig } from '@/config/site'
import { Flower } from 'lucide-react'
import Link from 'next/link'

interface LogoProps {
  disableText?: boolean
  className?: string
}

export function Logo({ disableText = false, className = '' }: LogoProps) {
  return (
    <Link href='/'>
      <div className={`flex items-center gap-2 ${className}`}>
        <Flower className='h-7 w-7 fill-yellow-500 stroke-yellow-500' />
        {!disableText && <span className='text-2xl font-bold'>{siteConfig.name}</span>}
      </div>
    </Link>
  )
}
