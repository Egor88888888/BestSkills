'use client'

import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BestSkills',
  description: 'Find and offer services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className + " bg-background text-foreground min-h-screen flex flex-col"}>
        <Providers>
          <Header />
          <main className="flex-1 container py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
} 