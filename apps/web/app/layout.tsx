import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BestSkills',
  description: 'Find and offer services',
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <button
      className="ml-4 px-3 py-1 rounded bg-accent text-accent-foreground border border-border hover:bg-primary hover:text-primary-foreground transition"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Переключить тему"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  )
}

function Header() {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
          BestSkills
        </Link>
        <nav className="flex items-center gap-4 text-base">
          <Link href="/tasks" className="hover:text-accent transition">Задачи</Link>
          <Link href="/services" className="hover:text-accent transition">Сервисы</Link>
          <Link href="/auth" className="hover:text-accent transition">Войти</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80 mt-12">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6 gap-2 text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} BestSkills. Все права защищены.</span>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-accent transition">О проекте</Link>
          <Link href="/contacts" className="hover:text-accent transition">Контакты</Link>
        </div>
      </div>
    </footer>
  )
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