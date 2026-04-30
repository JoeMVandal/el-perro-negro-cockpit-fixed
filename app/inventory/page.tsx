'use client'

import { Plus, AlertCircle, TrendingDown, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getInventory, deleteInventoryItem } from '@/lib/db'
import Link from 'next/link'

interface InventoryItemWithIngredient {
  id: string
  ingredient_id: string
  location: string
  amount: number
  unit: string
  reorder_point: number
  ingredient?: {
    id: string
    name: string
  }
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItemWithIngredient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadInventory()
  }, [])

  async function loadInventory() {
    try {
      setIsLoading(true)
      const data = await getInventory()
      setItems(data as InventoryItemWithIngredient[])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return
    try {
      await deleteInventoryItem(id)
      setItems(items.filter(i => i.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const criticalCount = items.filter(i => i.amount <= (i.reorder_point * 0.25)).length
  const lowCount = items.filter(i => i.amount > (i.reorder_point * 0.25) && i.amount <= i.reorder_point).length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-md mb-2">Inventory</h1>
          <p className="text-ink-400">Track stock levels and reorder points</p>
        </div>
        <Link href="/inventory/count" className="btn-primary">
          <Plus size={18} />
          Start Count
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-red-400" />
            <p className="text-ink-400 text-sm">Critical Stock</p>
          </div>
          <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} className="text-yellow-400" />
            <p className="text-ink-400 text-sm">Low Stock</p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{lowCount}</p>
        </div>
        <div className="card">
          <p className="text-ink-400 text-sm mb-2">Items Tracked</p>
          <p className="text-2xl font-bold text-agave-300">{items.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="card text-center py-12">
          <p className="text-ink-400">Loading inventory...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-ink-400">No inventory items yet</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-700">
                <th className="px-6 py-3 text-left text-sm font-medium text-ink-300">Item</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-ink-300">Location</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-ink-300">Stock</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-ink-300">Reorder at</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-ink-300">Status</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-ink-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const status = item.amount <= (item.reorder_point * 0.25) 
                  ? 'critical'
                  : item.amount <= item.reorder_point
                  ? 'low'
                  : 'good'

                return (
                  <tr key={item.id} className="border-b border-ink-700 hover:bg-ink-700/50">
                    <td className="px-6 py-4 font-medium">{item.ingredient?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-ink-400 text-sm capitalize">{item.location.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-right font-medium">{item.amount} {item.unit}</td>
                    <td className="px-6 py-4 text-right text-ink-400">{item.reorder_point} {item.unit}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`badge ${
                        status === 'critical' ? 'badge-danger' :
                        status === 'low' ? 'badge-warning' :
                        'badge-agave'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-ink-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
