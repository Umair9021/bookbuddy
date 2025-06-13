'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              router.replace('/dashboard')
            } else if (event === 'SIGNED_OUT' || !session) {
              router.replace('/auth/login')
            }
          }
        )
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.replace('/auth/login?error=callback_error')
          return
        }

        if (session) {
          router.replace('/dashboard')
        } else {
          setTimeout(() => {
            router.replace('/auth/login')
          }, 1000)
        }
        return () => {
          subscription?.unsubscribe()
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        router.replace('/auth/login?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-900">Processing authentication...</p>
        <p className="mt-2 text-sm text-gray-600">Please wait while we sign you in...</p>
      </div>
    </div>
  )
}