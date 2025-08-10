'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from "next/link"

import { supabase } from '@/lib/supabase/client'
import getImageSrc from '@/utils/getImageSrc'
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

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
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)
  const [avatarUrl, setAvatarUrl] = useState(null)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    closeMenu()
    closeMobileMenu()
  }

  const handleprofilepage = () => {
    router.push('Profile');
    closeMobileMenu()
  }

  const handledashboard = () => {
    router.push('userdashboard');
    closeMobileMenu()
  }

  const handleHowItWorks = () => {
    if (pathname === '/') {
      const element = document.getElementById('how-it-works-section');
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    } else {
      router.push('/#how-it-works-section');
    }
    closeMobileMenu()
  }

  const handleNavigation = (path) => {
    router.push(path)
    closeMobileMenu()
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          BookSwap
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 font-medium transition-all duration-200"
          >
            Home page
          </Button>
          <Button
            onClick={() => router.push('browse')}
            variant="ghost"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 font-medium transition-all duration-200"
          >
            Browse
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 font-medium transition-all duration-200"
          >
            Sell Books
          </Button>
          <Button
            onClick={handleHowItWorks}
            variant="ghost"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 font-medium transition-all duration-200"
          >
            How it works
          </Button>
          <Button
            onClick={() => router.push('contactus')}
            variant="ghost"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 font-medium transition-all duration-200"
          >
            Contact Us
          </Button>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          {!user ? (
            <Link href="/auth/login">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </Button>
            </Link>
          ) : (
            <div className="flex items-center space-x-6 mr-5">
              <Button
                onClick={handledashboard}
                variant="ghost"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 font-medium transition-all duration-200"
              >Dashboard</Button>
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center">
          {/* Mobile Menu - Always show user avatar or default user icon */}
          <div className="relative">
            <button
              onClick={toggleMobileMenu}
              className="flex rounded-full text-sm focus:outline-none border border-gray-300 p-1"
            >
              {user && avatarUrl ? (
                <img
                  className="w-8 h-8 rounded-full"
                  src={getImageSrc(avatarUrl)}
                  alt="User Menu"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </button>

            {mobileMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl ring-1 ring-black/5 z-20 overflow-hidden"
                role="menu"
              >
                {/* Auth Section - Show at top when not logged in */}
                {!user && (
                  <div className="border-b border-gray-100">
                    <Link href="/auth/login">
                      <button
                        className="w-full text-left px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 flex items-center gap-3 font-medium"
                        onClick={closeMobileMenu}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                        </svg>
                        Sign In
                      </button>
                    </Link>
                  </div>
                )}

                {/* User Section - Only show when logged in */}
                {user && (
                  <div className="border-b border-gray-100">
                    <div className="px-4 py-3 bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Account</p>
                    </div>
                    <button
                      onClick={handleprofilepage}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </button>
                    <button
                      onClick={handledashboard}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </button>
                  </div>
                )}

                {/* Navigation Section */}
                <div className={user ? "border-b border-gray-100" : ""}>
                  <div className="px-4 py-3 bg-gray-50">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Navigation</p>
                  </div>
                  <button
                    onClick={() => handleNavigation('/')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75V20a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5H10v5a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z"/>
                    </svg>
                    Home page
                  </button>
                  <button
                    onClick={() => handleNavigation('browse')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Sell Books
                  </button>
                  <button
                    onClick={handleHowItWorks}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How it works
                  </button>
                  <button
                    onClick={() => handleNavigation('contactus')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                  </button>
                </div>

                {/* Sign out section - Only show when logged in */}
                {user && (
                  <div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </header>
  )
}