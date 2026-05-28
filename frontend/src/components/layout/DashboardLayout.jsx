'use client'

import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()

  // Auth pages (no header/footer)
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // Show only auth form on login/signup pages
  if (isAuthPage) {
    return <div className="min-h-screen flex flex-col">{children}</div>
  }

  // Show header + content + footer on authenticated pages
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    )
  }

  // Redirect to login if not authenticated
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
