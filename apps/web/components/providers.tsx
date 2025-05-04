'use client';

import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/lib/auth-context'
import { ToastProvider } from '@/components/ui/use-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 