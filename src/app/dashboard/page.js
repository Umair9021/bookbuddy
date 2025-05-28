import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = supabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.email}</p>
      <form action={async () => {
        'use server'
        const supabase = supabaseServer()
        await supabase.auth.signOut()
        redirect('/auth/login')
      }}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  )
}