import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rehan - Website to Mobile App',
  description: 'Convert your website into a mobile app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gradient-to-b from-slate-100 via-purple-50 to-purple-100 dark:from-gray-950 dark:via-[#140F1F] dark:to-black`}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
