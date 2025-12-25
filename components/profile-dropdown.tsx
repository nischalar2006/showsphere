import { useState, useRef, useEffect } from "react"
import { User, LogOut, History, Settings, X, Heart, Newspaper, Film } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!user) return null

  const displayName = user.full_name || user.email?.split('@')[0] || "User"
  const userInitial = displayName.charAt(0).toUpperCase()


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-[#E5E7EB] font-bold border border-white/15 hover:border-[#2563EB] transition-colors"
      >
        {userInitial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="font-semibold text-gray-900">{displayName}</p>
            {user.phone_number && <p className="text-sm text-gray-600">{user.phone_number}</p>}
            {user.email && <p className="text-sm text-gray-600">{user.email}</p>}
          </div>

          {/* Menu Items */}
          <Link href="/profile" className="w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">My Profile</span>
            </button>
          </Link>

          <Link href="/favorites" className="w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">My Favorites</span>
            </button>
          </Link>

          <Link href="/my-bookings" className="w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">My Bookings</span>
            </button>
          </Link>

          <Link href="/cinenews" className="w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <Newspaper className="w-4 h-4" />
              <span className="text-sm font-medium">Cinema News</span>
            </button>
          </Link>

          <Link href="/trailers/upcoming" className="w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <Film className="w-4 h-4" />
              <span className="text-sm font-medium">Trailers</span>
            </button>
          </Link>

          <Link href="/settings" className="w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </Link>

          <div className="border-t border-gray-200 mt-2 pt-2">
            <button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
