'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import getImageSrc from '@/utils/getImageSrc';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser?.user_metadata?.picture) {
        setAvatarUrl(currentUser.user_metadata.picture)
      }
    }

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser?.user_metadata?.picture) {
        setAvatarUrl(currentUser.user_metadata.picture)
      }
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const toggleMenu = () => setMenuOpen(prev => !prev)
  const closeMenu = () => setMenuOpen(false)
   const [avatarUrl, setAvatarUrl] = useState(null)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    closeMenu()
  }

  const handleprofilepage = ()=>{
    router.push('profile');
  }
  
  const handledashboard = ()=>{
    router.push('userdashboard');
  }
  return (
    
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-primary text-primary-foreground shadow-md">
      <Link href="/" className="flex text-2xl font-bold pl-15">Bookbuddy</Link>

     <div className='flex items-center space-x-4'>
  {!user ? (
    <Link href="/auth/login">
      <Button variant="ghost" className="ml-4">Sign In</Button>
    </Link>
  ) : (
    <div className="flex items-center space-x-6 mr-5">
      <Button 
        onClick={handledashboard}
        variant="ghost">Dashboard</Button>
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <img
            className="w-8 h-8 rounded-full"
            src={getImageSrc(avatarUrl)}
            alt="User Profile"
          />
        </button>
        
        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-10"
            role="menu"
          >
          <button
            onClick={handleprofilepage}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Your Profile
          </button>
          
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
</div>
 )}
</div>

    </nav>
  )
}
