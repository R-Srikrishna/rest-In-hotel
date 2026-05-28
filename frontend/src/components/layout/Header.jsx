'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const Header = () => {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div>
      <div className="flex text-center mx-auto p-2 border border-radius rounded-full w-fit">
        <h1 className="text-gradient-blue">Rest-Inn</h1>
      </div>
      <nav className="mt-0 bg-blue-400 font-bold text-white text-2xl flex items-center justify-between px-5">
        <div className="flex gap-5">
          <Link href="/" className="hover:text-slate-200">Home</Link>
          <Link href="/rooms" className="hover:text-slate-200">Rooms</Link>
          <Link href="/bookings" className="hover:text-slate-200">Bookings</Link>
          <Link href="/guests" className="hover:text-slate-200">Guests</Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded transition-colors text-lg"
        >
          Logout
        </button>
      </nav>
    </div>
  )
}

export default Header