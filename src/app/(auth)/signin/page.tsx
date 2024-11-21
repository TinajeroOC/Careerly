import { SignInCard } from '@/components/cards/SignInCard'
import { Logo } from '@/components/misc/Logo'

export default function SignInPage() {
  return (
    <main className='w-full max-w-sm'>
      <Logo className='my-4 pl-6 md:pl-0' />
      <SignInCard />
    </main>
  )
}
