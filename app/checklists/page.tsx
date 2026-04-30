'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogIn, LogOut } from 'lucide-react'

export default function ChecklistsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="display-md mb-2">Shift Checklists</h1>
        <p className="text-ink-400">Opening and closing procedures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Opening Checklist */}
        <Link href="/checklists/opening">
          <div className="card hover:border-agave-300 cursor-pointer transition-colors h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-agave-900 rounded-lg">
                <LogIn className="text-agave-300" size={28} />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-xl mb-1">Opening</h2>
                <p className="text-ink-400 text-sm">34 tasks + daily sidework</p>
              </div>
            </div>
            <p className="text-ink-300 text-sm mb-6">
              Clock in, prep the bar, check systems, stock items, and get ready to open.
            </p>
            <div className="flex items-center gap-2 text-agave-300">
              <span className="text-sm font-medium">Start Checklist</span>
              <span>→</span>
            </div>
          </div>
        </Link>

        {/* Closing Checklist */}
        <Link href="/checklists/closing">
          <div className="card hover:border-agave-300 cursor-pointer transition-colors h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-agave-900 rounded-lg">
                <LogOut className="text-agave-300" size={28} />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-xl mb-1">Closing</h2>
                <p className="text-ink-400 text-sm">30 tasks + daily sidework</p>
              </div>
            </div>
            <p className="text-ink-300 text-sm mb-6">
              Stock items, clean equipment, cash out, and secure the bar.
            </p>
            <div className="flex items-center gap-2 text-agave-300">
              <span className="text-sm font-medium">Start Checklist</span>
              <span>→</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
