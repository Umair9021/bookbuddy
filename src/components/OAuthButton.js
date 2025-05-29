'use client'

import { supabase } from '@/lib/supabase/client'


export default function OAuthButton() {

  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
 const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })
  }

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
      },
    })
  }
 

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
  <button
    onClick={signInWithGoogle}
    type="button"
    className="flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer px-4 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 transition duration-150"
  >
    <svg className="w-4 h-4" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.3H272v95.2h146.9c-6.4 34.7-25.5 64.2-54.3 84v69.8h87.8c51.4-47.3 81.1-117 81.1-198.7z"/>
      <path fill="#34A853" d="M272 544.3c73.5 0 135.2-24.4 180.2-66.3l-87.8-69.8c-24.4 16.4-55.5 26.1-92.4 26.1-71 0-131.2-47.9-152.7-112.1H28.2v70.9C72.5 482.3 165.6 544.3 272 544.3z"/>
      <path fill="#FBBC05" d="M119.3 321.1c-10.4-30.7-10.4-63.9 0-94.6V155.6H28.2c-36.2 72.2-36.2 157.2 0 229.4l91.1-63.9z"/>
      <path fill="#EA4335" d="M272 107.3c39.8-.6 77.8 14.2 106.9 40.9l80.1-80.1C387.3 24.7 330.3 0 272 0 165.6 0 72.5 62 28.2 155.6l91.1 70.9c21.4-64.2 81.7-112.1 152.7-112.1z"/>
    </svg>
    <span>Google</span>
  </button>

  <button
    onClick={signInWithGithub}
    type="button"
    className="flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer px-4 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 transition duration-150"
  >
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0.297C5.373 0.297 0 5.67 0 12.297c0 5.289 3.438 9.773 8.205 11.387.6.111.82-.261.82-.579 0-.286-.011-1.04-.017-2.04-3.338.726-4.042-1.609-4.042-1.609-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.085 1.839 1.238 1.839 1.238 1.07 1.832 2.809 1.303 3.495.996.107-.775.418-1.303.761-1.602-2.665-.303-5.466-1.333-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.116-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.005-.404c1.02.005 2.047.138 3.005.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.625-5.475 5.921.43.372.814 1.104.814 2.229 0 1.609-.015 2.906-.015 3.301 0 .321.216.694.825.576C20.565 22.066 24 17.584 24 12.297 24 5.67 18.627 0.297 12 0.297z"/>
    </svg>
    <span>GitHub</span>
  </button>
</div>


  )
}
