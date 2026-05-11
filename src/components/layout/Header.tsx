'use client'

import { Menu, Bell } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  onMenuClick: () => void
  title?: string
  unreadCount?: number
}

export default function Header({ onMenuClick, title = 'Dashboard', unreadCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Link>
          <Link href="/dashboard/settings" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors">
            R
          </Link>
        </div>
      </div>
    </header>
  )
}
