'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoIcon } from './Logo'
import {
  BarChart3,
  Beaker,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  DollarSign,
  ClipboardCheck,
  Zap,
  Waves,
  TrendingUp,
  Flame,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { label: 'Recipes', href: '/recipes', icon: Beaker },
    { label: 'Pour Cost', href: '/pour-cost', icon: DollarSign },
    { label: 'Batch Calc', href: '/batch-calc', icon: Beaker },
    { label: 'Carbonation', href: '/carbonation-calc', icon: Waves },
    { label: 'ABV Calc', href: '/abv-calc', icon: Flame },
    { label: 'Pricing', href: '/pricing', icon: TrendingUp },
    { label: 'Inventory', href: '/inventory', icon: ClipboardList },
    { label: 'Prep Lists', href: '/prep', icon: Zap },
    { label: 'Checklists', href: '/checklists', icon: ClipboardCheck },
    { label: 'Staff Notes', href: '/notes', icon: Users },
    { label: 'Admin', href: '/admin', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-ink-800 border-r border-ink-700 h-screen flex flex-col">
      <div className="p-6 border-b border-ink-700">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <LogoIcon size={40} />
          <span className="font-display font-bold text-lg text-agave-300">El Perro Negro</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                active
                  ? 'bg-agave-300 text-ink-900 font-medium'
                  : 'text-ink-300 hover:bg-ink-700'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-ink-700">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-2 text-ink-300 hover:bg-ink-700 rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
