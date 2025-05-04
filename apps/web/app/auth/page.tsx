import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'

const AuthPageClient = dynamic(() => import('@/components/auth-page-client'), {
  ssr: false
})

export default async function AuthPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return <AuthPageClient />
} 