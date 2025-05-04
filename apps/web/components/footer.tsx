'use client'

import Link from 'next/link'

export function Footer() {
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