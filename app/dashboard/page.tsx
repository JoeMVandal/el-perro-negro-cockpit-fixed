'use client'

import { AlertCircle, TrendingDown, Clock, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getInventory, getPrepList, getStaffNotes } from '@/lib/db'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    lowStock: 0,
    expiring: 0,
    prepTasks: 0,
    notes: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const [inventory, prep, notes] = await Promise.all([
        getInventory(),
        getPrepList(),
        getStaffNotes(),
      ])

      const lowStockCount = inventory.filter(i => 
        i.amount && i.reorder_point && i.amount <= i.reorder_point
      ).length

      setStats({
        lowStock: lowStockCount,
        expiring: 0, // Would need shelf_life tracking
        prepTasks: prep.filter(p => !p.completed).length,
        notes: notes.length,
      })
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    { label: 'Low Stock Items', value: stats.lowStock, icon: AlertCircle, color: 'agave' },
    { label: 'Expiring Soon', value: stats.expiring, icon: Clock, color: 'orange' },
    { label: 'Prep Tasks', value: stats.prepTasks, icon: TrendingDown, color: 'blue' },
    { label: 'Recent Notes', value: stats.notes, icon: Users, color: 'green' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="display-md mb-2">Dashboard</h1>
        <p className="text-ink-400">Welcome to El Perro Negro Cockpit</p>
      </div>

      {isLoading ? (
        <div className="card text-center py-12">
          <p className="text-ink-400">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-ink-400 text-sm mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-agave-300">{stat.value}</p>
                    </div>
                    <Icon className="text-agave-300 opacity-50" size={24} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="display-sm mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/recipes/new" className="btn-secondary w-full text-left block">
                  + Add Recipe
                </Link>
                <Link href="/inventory/count" className="btn-secondary w-full text-left block">
                  Start Inventory Count
                </Link>
                <Link href="/prep" className="btn-secondary w-full text-left block">
                  View Prep List
                </Link>
              </div>
            </div>

            <div className="card">
              <h2 className="display-sm mb-4">Resources</h2>
              <div className="space-y-3">
                <a href="/BRAND.md" className="block text-agave-300 hover:text-agave-200">
                  → Brand Guidelines
                </a>
                <a href="/README.md" className="block text-agave-300 hover:text-agave-200">
                  → User Guide
                </a>
                <Link href="/admin" className="block text-agave-300 hover:text-agave-200">
                  → Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
