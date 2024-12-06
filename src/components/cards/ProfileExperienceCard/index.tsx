'use client'

import { format, formatDistanceStrict } from 'date-fns'
import { Edit, SquarePlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Separator } from '@/components/ui/Separator'
import { Database } from '@/types/supabase'

interface ProfileExperienceCardProps {
  experiences: Database['public']['Tables']['profile_experiences']['Row'][]
  isEditable?: boolean
}

export function ProfileExperienceCard({ experiences, isEditable }: ProfileExperienceCardProps) {
  const pathname = usePathname()

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <CardTitle className='flex-grow'>Experience</CardTitle>
          {isEditable && (
            <>
              <Link href={`${pathname}/add-experience`} scroll={false}>
                <Button size='icon' variant='ghost'>
                  <SquarePlus />
                </Button>
              </Link>
              <Link href={`${pathname}/update-experience`} scroll={false}>
                <Button size='icon' variant='ghost'>
                  <Edit />
                </Button>
              </Link>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          {experiences
            .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
            .map((experience) => (
              <Fragment key={experience.id}>
                <div>
                  <div className='mb-2 flex flex-col gap-1'>
                    <span className='text-lg font-semibold'>{experience.title}</span>
                    <span className='font-medium'>
                      <span>{experience.company_name}</span>
                      <span className='px-2'>·</span>
                      <span>{experience.employment_type}</span>
                    </span>
                    <span className='text-sm font-light'>
                      <span>{format(experience.start_date, 'MMM yyyy')}</span>
                      <span className='px-2'>-</span>
                      <span>
                        {experience.end_date ? format(experience.end_date, 'MMM yyyy') : 'Present'}
                      </span>
                      <span className='px-2'>·</span>
                      <span>
                        {formatDistanceStrict(
                          experience.start_date,
                          experience.end_date ? experience.end_date : Date.now()
                        )}
                      </span>
                    </span>
                    <span className='text-sm font-light'>
                      <span className='text-sm font-light'>{experience.location}</span>
                      <span className='px-2'>·</span>
                      <span className='text-sm font-light'>{experience.location_type}</span>
                    </span>
                  </div>
                  <p className='font-light'>{experience.description}</p>
                </div>
                <Separator />
              </Fragment>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
