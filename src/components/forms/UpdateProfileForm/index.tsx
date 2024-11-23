'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { updateProfile } from '@/actions/user'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
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
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import { ProfileInput, profileSchema } from '@/lib/validations/user'

interface UpdateProfileFormProps {
  setModalOpen: (isOpen: boolean) => void
}

export function UpdateProfileForm({ setModalOpen }: UpdateProfileFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: async () => {
      const supabase = createClient()

      const { data: getUser, error: getUserError } = await supabase.auth.getUser()

      if (getUserError) throw getUserError

      const { data: getUserProfile, error: getUserProfileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', getUser.user?.id)

      if (getUserProfileError) throw getUserProfileError

      return {
        headline: getUserProfile[0].headline,
        about: getUserProfile[0].about,
      }
    },
  })

  const onSubmit: SubmitHandler<ProfileInput> = async (data) => {
    try {
      setLoading(true)
      await updateProfile(data)
    } catch (error) {
      form.setError('root', { message: (error as Error).message })
    } finally {
      setLoading(false)
      setModalOpen(false)
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
        {form.formState.errors.root && (
          <Alert variant='destructive'>
            <CircleAlert className='h-4 w-4' />
            <AlertTitle>There was an issue updating your account</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='headline'
          defaultValue=''
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription className='text-right'>{`${form.watch('headline')?.length ?? 0}/120`}</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          name='about'
          defaultValue=''
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea {...field} className='min-h-40' />
              </FormControl>
              <FormMessage />
              <FormDescription className='text-right'>{`${form.watch('about')?.length ?? 0}/2000`}</FormDescription>
            </FormItem>
          )}
        />
        <div className='pt-2'>
          <Button disabled={loading} type='submit' className='w-full'>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
