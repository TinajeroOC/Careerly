import './globals.css'

import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'

import { Toaster } from '@/components/ui/Toaster'
import { siteConfig } from '@/config/site'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { createClient } from '@/lib/supabase/server'

interface RootLayoutProps {
  readonly children: React.ReactNode
}

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = await createClient()

  const userResponse = await supabase.auth.getUser()

  return (
    <html lang='en'>
      <body className={GeistSans.className}>
        <AppNavbar user={userResponse.data.user} />
        <div className='mx-auto w-full max-w-screen-2xl'>{children}</div>
        <Toaster />
      </body>
    </html>
  )
}
