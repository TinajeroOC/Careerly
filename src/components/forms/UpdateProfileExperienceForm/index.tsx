'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { updateProfileExperience } from '@/actions/user'
import { DeleteProfileExperienceModal } from '@/components/modals/DeleteProfileExperienceModal'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { CalendarDatePicker } from '@/components/ui/CalendarDatePicker'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { ScrollArea } from '@/components/ui/ScrollArea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import { ProfileExperienceInput, profileExperienceSchema } from '@/lib/validations/user'

export function UpdateProfileExperienceForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const params = useParams()
  const form = useForm<ProfileExperienceInput>({
    resolver: zodResolver(profileExperienceSchema),
    defaultValues: async () => {
      const supabase = createClient()

      const { experienceId } = params

      if (typeof experienceId !== 'string') throw new Error('Invalid parameters')

      const { data: experience, error: experienceError } = await supabase
        .from('profile_experiences')
        .select()
        .eq('id', params.experienceId!)
        .single()

      if (experienceError) throw experienceError

      return {
        title: experience.title,
        description: experience.description,
        companyName: experience.company_name,
        employmentType: experience.employment_type,
        location: experience.location,
        locationType: experience.location_type,
        activeRole: true,
        startDate: {
          from: new Date(experience.start_date),
          to: new Date(experience.start_date),
        },
        endDate: {
          from: experience.end_date ? new Date(experience.end_date) : new Date(),
          to: experience.end_date ? new Date(experience.end_date) : new Date(),
        },
      }
    },
  })

  const onSubmit: SubmitHandler<ProfileExperienceInput> = async (data) => {
    try {
      setLoading(true)
      await updateProfileExperience(params.experienceId as string, data)
      router.back()
    } catch (error) {
      form.setError('root', { message: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        autoComplete='off'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-2'
      >
        <div className='px-6'>
          {form.formState.errors.root && (
            <Alert variant='destructive'>
              <CircleAlert className='h-4 w-4' />
              <AlertTitle>There was an issue updating your profile</AlertTitle>
              <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
            </Alert>
          )}
        </div>
        <ScrollArea className='h-[448px]'>
          <div className='flex flex-col gap-2 px-6'>
            <FormField
              name='title'
              defaultValue=''
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. Principal Software Engineer' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='companyName'
              defaultValue=''
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. Microsoft' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='employmentType'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type</FormLabel>
                  <Select
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select employment type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        'Full-time',
                        'Part-time',
                        'Internship',
                        'Contract',
                        'Seasonal',
                        'Freelance',
                        'Self-employed',
                      ].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='activeRole'
              defaultValue={true}
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex items-end justify-start gap-2 py-3'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>I am currently working in this role</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col gap-2 md:flex-row'>
              <FormField
                name='startDate'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <CalendarDatePicker
                        date={field.value}
                        onDateSelect={({ from, to }) => {
                          form.setValue('startDate', { from, to })
                        }}
                        yearsRange={100}
                        variant='outline'
                        numberOfMonths={1}
                        className='w-full min-w-56'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='endDate'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <CalendarDatePicker
                        date={field.value}
                        onDateSelect={({ from, to }) => {
                          form.setValue('endDate', { from, to })
                        }}
                        yearsRange={50}
                        variant='outline'
                        numberOfMonths={1}
                        disabled={form.watch('activeRole')}
                        className='w-full min-w-56'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name='location'
              defaultValue=''
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. Seattle, WA' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='locationType'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Type</FormLabel>
                  <Select
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select location type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['On-site', 'Hybrid', 'Remote'].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='description'
              defaultValue=''
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className='min-h-40'
                      placeholder='List your responsibilities and highlight important projects'
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className='text-right'>{`${form.watch('description')?.length ?? 0}/2000`}</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <div className='flex justify-end gap-2 px-6 pt-2'>
          <DeleteProfileExperienceModal />
          <Button disabled={loading} type='submit'>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
