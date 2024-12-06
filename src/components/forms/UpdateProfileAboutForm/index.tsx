'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { updateProfileAbout } from '@/actions/user'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/Form'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import { ProfileAboutInput, profileAboutSchema } from '@/lib/validations/user'

export function UpdateProfileAboutForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<ProfileAboutInput>({
    resolver: zodResolver(profileAboutSchema),
    defaultValues: async () => {
      const supabase = createClient()

      const { data: user, error: userError } = await supabase.auth.getUser()

      if (userError) throw userError

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.user?.id)

      if (profileError) throw profileError

      return {
        about: profile[0].about,
      }
    },
  })

  const onSubmit: SubmitHandler<ProfileAboutInput> = async (data) => {
    try {
      setLoading(true)
      await updateProfileAbout(data)
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
        {form.formState.errors.root && (
          <Alert variant='destructive'>
            <CircleAlert className='h-4 w-4' />
            <AlertTitle>There was an issue updating your profile</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='about'
          defaultValue=''
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} className='min-h-40' placeholder='About' />
              </FormControl>
              <FormMessage />
              <FormDescription className='text-right'>{`${form.watch('about')?.length ?? 0}/2000`}</FormDescription>
            </FormItem>
          )}
        />
        <div className='flex justify-end pt-2'>
          <Button disabled={loading} type='submit'>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
