'use client'

import { AlertCircle, Edit, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { getPrepItemsForDay, PREP_TEMPLATES } from '@/lib/prep-templates'
import type { PrepItem } from '@/lib/prep-templates'
import Link from 'next/link'

export default function PrepTemplatesPage() {
  const [selectedDay, setSelectedDay] = useState('MONDAY')
  const [items, setItems] = useState<PrepItem[]>(getPrepItemsForDay('MONDAY'))

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

  const handleSelectDay = (day: string) => {
    setSelectedDay(day)
    setItems(getPrepItemsForDay(day))
  }

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, PrepItem[]>)

  return (
    <div className="p-8">
      <Link href="/admin" className="text-agave-300 hover:text-agave-200 text-sm mb-4 block">
        ← Back to Admin
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-md mb-2">Prep Templates</h1>
          <p className="text-ink-400">Customize daily prep sheets by day of week</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className="card mb-8">
        <h2 className="font-medium mb-4">Select Day</h2>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => handleSelectDay(day)}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                selectedDay === day
                  ? 'bg-agave-300 text-ink-900'
                  : 'bg-ink-700 text-ink-300 hover:bg-ink-600'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-display font-bold text-lg mb-4">{selectedDay} — {items.length} items</h2>

        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="font-medium text-agave-300 mb-3 text-sm uppercase">{category}</h3>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-ink-700/50 rounded-md">
                    <div>
                      <p className="font-medium text-sm">{item.item}</p>
                      <p className="text-ink-500 text-xs">{item.containerSize} — PAR: {item.par}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-ink-500 hover:text-agave-300 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="text-ink-500 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-ink-700/30 rounded-md">
          <p className="text-ink-400 text-sm">
            💡 Tip: Edit prep items here to customize your daily prep sheets. Changes appear immediately in the prep sheet.
          </p>
        </div>
      </div>
    </div>
  )
}
