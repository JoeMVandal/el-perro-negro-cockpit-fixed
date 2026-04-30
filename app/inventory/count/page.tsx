'use client'

import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CountPage() {
  const [location, setLocation] = useState('main_bar')
  const [items, setItems] = useState([
    { id: '1', name: 'Tequila Blanco', current: 5.5, counted: 0 },
    { id: '2', name: 'Mezcal Oaxaca', current: 2.0, counted: 0 },
    { id: '3', name: 'Lime Juice', current: 3.0, counted: 0 },
  ])

  return (
    <div className="p-8">
      <Link href="/inventory" className="flex items-center gap-2 text-agave-300 hover:text-agave-200 mb-8">
        <ArrowLeft size={18} />
        Back to Inventory
      </Link>

      <div className="max-w-2xl">
        <div className="card mb-8">
          <h1 className="display-md mb-6">Start Inventory Count</h1>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="main_bar">Main Bar</option>
              <option value="service_well">Service Well</option>
              <option value="back_stock">Back Stock</option>
              <option value="walk_in">Walk-in</option>
            </select>
          </div>

          <div className="space-y-4">
            <p className="text-ink-400 text-sm">Count each item and enter the amount</p>
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-ink-700/50 rounded-md">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-ink-400 text-sm">System: {item.current} bottles</p>
                </div>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={item.counted || ''}
                  onChange={(e) => {
                    const newItems = items.map(i =>
                      i.id === item.id ? { ...i, counted: parseFloat(e.target.value) || 0 } : i
                    )
                    setItems(newItems)
                  }}
                  className="w-24"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button className="btn-primary">
              <Save size={18} />
              Save Count
            </button>
            <Link href="/inventory" className="btn-secondary">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
