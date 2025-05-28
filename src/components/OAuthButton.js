'use client'

import { supabase } from '@/lib/supabase/client'

export default function OAuthButton() {
  const handleOAuthLogin = async () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })
  }

  return (
    <button
      onClick={handleOAuthLogin}
      type="button"
      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
    >
      {/* Google Icon */}
       <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#4285F4"
          d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.3H272v95.2h146.9c-6.4 34.7-25.5 64.2-54.3 84v69.8h87.8c51.4-47.3 81.1-117 81.1-198.7z"
        />
        <path
          fill="#34A853"
          d="M272 544.3c73.5 0 135.2-24.4 180.2-66.3l-87.8-69.8c-24.4 16.4-55.5 26.1-92.4 26.1-71 0-131.2-47.9-152.7-112.1H28.2v70.9C72.5 482.3 165.6 544.3 272 544.3z"
        />
        <path
          fill="#FBBC05"
          d="M119.3 321.1c-10.4-30.7-10.4-63.9 0-94.6V155.6H28.2c-36.2 72.2-36.2 157.2 0 229.4l91.1-63.9z"
        />
        <path
          fill="#EA4335"
          d="M272 107.3c39.8-.6 77.8 14.2 106.9 40.9l80.1-80.1C387.3 24.7 330.3 0 272 0 165.6 0 72.5 62 28.2 155.6l91.1 70.9c21.4-64.2 81.7-112.1 152.7-112.1z"
        />
      </svg>
      <span className="ml-2">Sign in with Google</span>
    </button>
  )
}
