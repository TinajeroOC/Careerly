'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { addProfileExperience } from '@/actions/user'
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
import { ProfileExperienceInput, profileExperienceSchema } from '@/lib/validations/user'

export function AddProfileExperienceForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<ProfileExperienceInput>({
    resolver: zodResolver(profileExperienceSchema),
    defaultValues: {
      title: '',
      description: '',
      companyName: '',
      location: '',
      activeRole: true,
      startDate: {
        from: new Date(),
        to: new Date(),
      },
      endDate: {
        from: new Date(),
        to: new Date(),
      },
    },
  })

  const onSubmit: SubmitHandler<ProfileExperienceInput> = async (data) => {
    try {
      setLoading(true)
      await addProfileExperience(data)
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
        <ScrollArea className='h-[448px] bg-card'>
          <div className='flex flex-col gap-2 px-6'>
            <FormField
              name='title'
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
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
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
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
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
        <div className='flex justify-end px-6 pt-2'>
          <Button disabled={loading} type='submit'>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
