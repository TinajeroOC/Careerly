import Link from 'next/link'

import { SignInForm } from '@/components/forms/SignInForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

export function SignInCard() {
  return (
    <Card className='border-0 shadow-none md:border md:shadow-sm'>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Welcome back to Careerly</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className='flex flex-row justify-center gap-2 text-sm text-muted-foreground'>
        <span>Don&apos;t have an account?</span>
        <Link href='/signup' className='underline underline-offset-4'>
          Sign Up
        </Link>
      </CardFooter>
    </Card>
  )
}
