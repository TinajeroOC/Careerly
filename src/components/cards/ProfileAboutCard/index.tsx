'use client'

import { Edit } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Database } from '@/types/supabase'

interface ProfileAboutCardProps {
  profile: Database['public']['Tables']['profiles']['Row']
  isEditable?: boolean
}

export function ProfileAboutCard({ profile, isEditable }: ProfileAboutCardProps) {
  const pathname = usePathname()

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center'>
          <CardTitle className='flex-grow'>About</CardTitle>
          {isEditable && (
            <Link href={`${pathname}/update-about`} scroll={false}>
              <Button size='icon' variant='ghost'>
                <Edit />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className='font-light'>{profile.about}</p>
      </CardContent>
    </Card>
  )
}
