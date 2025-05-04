'use client';

import { AuthForm } from '@/components/auth-form'
import { ToastProvider } from '@/components/ui/use-toast'

export default function AuthPageClient() {
  return (
    <ToastProvider>
      <div className="container flex items-center justify-center min-h-screen py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to BarterHours</h1>
            <p className="text-muted-foreground">
              Sign in to start exchanging services
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </ToastProvider>
  )
} 