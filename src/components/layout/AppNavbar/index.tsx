'use client'

import { ThemeDropdown } from '@/components/dropdowns/ThemeDropdown'
import { UserDropdown } from '@/components/dropdowns/UserDropdown'
import { Logo } from '@/components/misc/Logo'
import { Button } from '@/components/ui/Button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { User } from '@supabase/supabase-js'
import { User2Icon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const desktop = '(min-width: 768px)'

interface AppNavbarProps {
  user: User | null
}

export function AppNavbar({ user }: AppNavbarProps) {
  const pathname = usePathname()
  const isDesktop = useMediaQuery(desktop)
  const isAuthPath = pathname.startsWith('/signin') || pathname.startsWith('/signup')

  if (isAuthPath) {
    return null
  }

  return (
    <nav className='sticky top-0 z-40 h-auto w-full border-b bg-background'>
      <header className='relative z-40 mx-auto flex h-16 w-full max-w-screen-2xl flex-row flex-nowrap items-center justify-between gap-4 px-4 md:px-8'>
        <div className='flex flex-grow basis-0 flex-row flex-nowrap items-center justify-start gap-1'>
          <Logo disableText={isDesktop ? false : true} />
        </div>
        <div className='flex flex-grow items-center justify-end gap-2'>
          <ThemeDropdown />
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <>
              <Button
                size={isDesktop ? 'default' : 'icon'}
                variant='outline'
                className='sm:min-w-24'
                asChild
              >
                <Link href='/signin'>
                  <User2Icon className='block h-4 w-4 md:hidden' />
                  <span className='hidden md:block'>Sign In</span>
                </Link>
              </Button>
              <Button className='min-w-24' asChild>
                <Link href='/signup'>
                  <span>Sign Up</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </header>
    </nav>
  )
}
