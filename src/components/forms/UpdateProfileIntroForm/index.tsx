'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { updateProfileIntro } from '@/actions/user'
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
import { createClient } from '@/lib/supabase/client'
import { ProfileIntroInput, profileIntroSchema } from '@/lib/validations/user'

export function UpdateProfileIntroForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<ProfileIntroInput>({
    resolver: zodResolver(profileIntroSchema),
    defaultValues: async () => {
      const supabase = createClient()

      const { data: user, error: userError } = await supabase.auth.getUser()

      if (userError) throw userError

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.user?.id)
        .single()

      if (profileError) throw profileError

      return {
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        headline: profile?.headline,
      }
    },
  })

  const onSubmit: SubmitHandler<ProfileIntroInput> = async (data) => {
    try {
      setLoading(true)
      await updateProfileIntro(data)
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
        <div className='flex flex-col gap-4 md:flex-row'>
          <FormField
            name='firstName'
            defaultValue=''
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='lastName'
            defaultValue=''
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
