'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setMessage('No active session. Please use the reset link from your email.')
      }
    })
  }, [])

  async function handlePasswordUpdate(e) {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Password updated successfully! Redirecting...')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }

    setLoading(false)
  }

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
  <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg max-w-md w-full">
    <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-900">
      Set a New Password
    </h1>

    <form onSubmit={handlePasswordUpdate} className="space-y-4 sm:space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
          text-sm sm:text-base"
          placeholder="Enter new password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
          text-sm sm:text-base"
          placeholder="Re-enter password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
        shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>

    {message && (
      <p className="mt-4 text-sm sm:text-base text-center text-blue-600">{message}</p>
    )}
  </div>
</div>

  )
}
