"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getSession } from "@/app/components/api"
import { BookOpen, Users, LayoutDashboard, LogIn, UserPlus, Menu, X } from "lucide-react"

export default function Navbar() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getSession()
        setIsAuthed(Boolean(data?.message?.isAuthenticated))
      } catch {}
    })()
  }, [])

  return (
    <header className="h-16 border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <nav className="max-w-6xl mx-auto h-full flex items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          EduManthan
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          {!isAuthed ? (
            <>
              <Link
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all duration-200 active:scale-95"
                href="/signup"
              >
                <UserPlus className="w-4 h-4" />
                Sign up
              </Link>
              <Link
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                href="/signin"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
            </>
          ) : (
            <>
              <Link
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                href="/community"
              >
                <Users className="w-4 h-4" />
                Community
              </Link>
              <Link
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 active:scale-95"
                href="/dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </>
          )}
        </div>

        <button
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b shadow-lg">
          <div className="p-4 space-y-3">
            {!isAuthed ? (
              <>
                <Link
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-center justify-center"
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="w-4 h-4" />
                  Sign up
                </Link>
                <Link
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-center justify-center"
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  Sign in
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 justify-center"
                  href="/community"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="w-4 h-4" />
                  Community
                </Link>
                <Link
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-gray-900 text-white justify-center"
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
