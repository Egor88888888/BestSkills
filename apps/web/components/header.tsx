'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

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

export function Header() {
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