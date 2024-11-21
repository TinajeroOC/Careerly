'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { LogOut, Settings } from 'lucide-react'
import Link from 'next/link'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface UserDropdownProps {
  user: User
}

export function UserDropdown({ user }: UserDropdownProps) {
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const onSignOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' })

    if (error) {
      toast({
        title: 'Unable to sign out',
        description: 'Please try again later',
      })
    } else {
      router.refresh()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='h-10 w-10 rounded-md'>
          <AvatarFallback className='select-none rounded-md'>
            {user.user_metadata.first_name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-64'>
        <DropdownMenuLabel>
          <div className='flex items-center gap-3 py-1.5 text-left text-sm'>
            <Avatar className='h-12 w-12 rounded-sm'>
              <AvatarFallback className='select-none'>
                {user.user_metadata.first_name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm'>
              <span className='truncate font-semibold'>{user.user_metadata.display_name}</span>
              <span className='truncate text-xs font-normal text-muted-foreground'>
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href='/settings'>
          <DropdownMenuItem className='hover:cursor-pointer'>
            <Settings />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className='hover:cursor-pointer'>
          <LogOut />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
