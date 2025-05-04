'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80 mt-16 shadow-inner">
      <div className="container flex flex-col md:flex-row items-center justify-between py-8 gap-4 text-sm text-muted-foreground">
        <span className="font-medium">© {new Date().getFullYear()} BestSkills</span>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-primary transition-colors">О проекте</Link>
          <Link href="/contacts" className="hover:text-primary transition-colors">Контакты</Link>
        </div>
      </div>
    </footer>
  )
} 