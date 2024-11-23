'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { updatePersonalInformation } from '@/actions/user'
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
import { createClient } from '@/lib/supabase/client'
import { PersonalInformationInput, personalInformationSchema } from '@/lib/validations/user'

interface UpdatePersonalInformationFormProps {
  setModalOpen: (isOpen: boolean) => void
}

export function UpdatePersonalInformationForm({
  setModalOpen,
}: UpdatePersonalInformationFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const form = useForm<PersonalInformationInput>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: async () => {
      const supabase = createClient()

      const { data: getUser, error: getUserError } = await supabase.auth.getUser()

      if (getUserError) throw getUserError

      return {
        firstName: getUser.user?.user_metadata.first_name,
        lastName: getUser.user?.user_metadata.last_name,
      }
    },
  })

  const onSubmit: SubmitHandler<PersonalInformationInput> = async (data) => {
    try {
      setLoading(true)
      await updatePersonalInformation(data)
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
