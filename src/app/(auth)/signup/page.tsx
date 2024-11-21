import { SignUpCard } from '@/components/cards/SignUpCard'
import { Logo } from '@/components/misc/Logo'

export default function SignUpPage() {
  return (
    <main className='w-full max-w-sm'>
      <Logo className='my-4 pl-6 md:pl-0' />
      <SignUpCard />
    </main>
  )
}
