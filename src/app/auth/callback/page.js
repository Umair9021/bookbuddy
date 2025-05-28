'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()

      if (session) {
        router.replace('/dashboard') // or any post-login route
      } else {
        router.replace('/auth/login') // fallback in case of error
      }
    }

    handleRedirect()
  }, [router])

  return <p className="text-center mt-20">Loading...</p>
}
