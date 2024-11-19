import './globals.css'

import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'

import { siteConfig } from '@/config/config'

interface RootLayoutProps {
  readonly children: React.ReactNode
}

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={GeistSans.className}>{children}</body>
    </html>
  )
}
