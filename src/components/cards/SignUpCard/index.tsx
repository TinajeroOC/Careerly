import Link from 'next/link'

import { SignUpForm } from '@/components/forms/SignUpForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

export function SignUpCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Elevate your career with Careerly</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter className='flex flex-row justify-center gap-2 text-sm text-muted-foreground'>
        <span>Already have an account?</span>
        <Link href='/signin' className='underline underline-offset-4'>
          Sign In
        </Link>
      </CardFooter>
    </Card>
  )
}
