'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <button
      className="ml-2 p-2 rounded-full border border-border bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Переключить тему"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

export function Header() {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary hover:text-yellow-500 transition-colors">
          <span className="bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-100 bg-clip-text text-transparent">BestSkills</span>
        </Link>
        <nav className="flex items-center gap-2 md:gap-6 text-base font-medium">
          <Link href="/tasks" className="px-3 py-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors">Задачи</Link>
          <Link href="/services" className="px-3 py-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors">Сервисы</Link>
          <Link href="/auth" className="px-3 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">Войти</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
} 