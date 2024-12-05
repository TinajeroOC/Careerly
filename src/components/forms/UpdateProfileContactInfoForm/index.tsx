'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { updateProfileContactInfo } from '@/actions/user'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { InputPhone } from '@/components/ui/InputPhone'
import { createClient } from '@/lib/supabase/client'
import { ProfileContactInfoInput, profileContactInfoSchema } from '@/lib/validations/user'

export function UpdateProfileContactInfoForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<ProfileContactInfoInput>({
    resolver: zodResolver(profileContactInfoSchema),
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
        publicEmail: profile.public_email,
        publicPhoneNumber: profile.public_phone_number,
        publicWebsiteUrl: profile.public_website_url,
      }
    },
  })

  const onSubmit: SubmitHandler<ProfileContactInfoInput> = async (data) => {
    try {
      setLoading(true)
      await updateProfileContactInfo(data)
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
          name='publicEmail'
          defaultValue=''
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='publicPhoneNumber'
          defaultValue=''
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <InputPhone {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='publicWebsiteUrl'
          defaultValue=''
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
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
