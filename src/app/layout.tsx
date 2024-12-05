import './globals.css'

import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'

import { AppNavbar } from '@/components/layout/AppNavbar'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { siteConfig } from '@/config/site'
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
    <html lang='en' suppressHydrationWarning>
      <body className={ny(GeistSans.className, 'bg-secondary', 'dark:bg-secondary/50')}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <AppNavbar user={userResponse.data.user} />
          <div className='mx-auto w-full max-w-screen-xl'>{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
