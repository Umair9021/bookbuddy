'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function CallbackPage() {
  const router = useRouter()
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user) {
          router.replace('/auth/login')
          return
        }

        const userId = session.user.id
        const email = session.user.email
        const name =
          session.user.user_metadata?.name ||
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.user_name ||
          ''

          const role = email === ADMIN_EMAIL ? 'admin' : 'user';

        const checkRes = await fetch(`/api/users/${userId}`);

        if (checkRes.status === 404) {
          // User doesn’t exist → create
          await fetch('/api/users/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: userId, email, name ,role }),
          });
        } else if (checkRes.ok) {
          const existingUser = await checkRes.json();
          if (existingUser.isSuspended) {
            await supabase.auth.signOut();
            router.replace('/auth/suspended');
            return;
          }
        } else {
          throw new Error('Failed to check user');
        }

        router.replace('/');


      } catch (err) {
        console.error('❌ Callback error:', err)
        router.replace('/auth/login')
      }
    }

    handleAuth()
  }, [router])

  return (
    <div
      className={`min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-900">Processing authentication...</p>
        <p className="mt-2 text-sm text-gray-600">Please wait while we sign you in...</p>
      </div>
    </div>
  )
}
