'use client'

import { Plus, Trash2, Shield, User, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { listUsers } from '@/lib/db'
import type { User as UserType } from '@/lib/types'

export default function AdminPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setIsLoading(true)
      const data = await listUsers()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-md mb-2">Admin</h1>
          <p className="text-ink-400">User management and settings</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Invite User
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="card overflow-hidden mb-8">
        <h2 className="font-display font-bold text-lg px-6 py-4 border-b border-ink-700">Users</h2>
        
        {isLoading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-ink-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-ink-400">No users yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-700">
                <th className="px-6 py-3 text-left text-sm font-medium text-ink-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-ink-300">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-ink-300">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-ink-300">Joined</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-ink-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-ink-700 hover:bg-ink-700/50">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-ink-400 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === 'manager' ? (
                        <Shield size={16} className="text-agave-300" />
                      ) : (
                        <User size={16} className="text-ink-500" />
                      )}
                      <span className="capitalize text-sm">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ink-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-ink-500 hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2 className="display-sm mb-6">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-ink-700/50 rounded-md">
            <div>
              <p className="font-medium">Data Export</p>
              <p className="text-ink-400 text-sm">Export all recipes, inventory, and notes</p>
            </div>
            <button className="btn-secondary">Export</button>
          </div>
          <div className="flex items-center justify-between p-4 bg-ink-700/50 rounded-md">
            <div>
              <p className="font-medium">Database</p>
              <p className="text-ink-400 text-sm">View Supabase connection status</p>
            </div>
            <button className="btn-secondary">Check</button>
          </div>
        </div>
      </div>
    </div>
  )
}
