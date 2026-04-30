'use client'

import { useState, useEffect } from 'react'
import { Printer, Home } from 'lucide-react'
import { getPrepItemsForDay, getDayOfWeek } from '@/lib/prep-templates'
import type { PrepItem } from '@/lib/prep-templates'
import Link from 'next/link'

export default function PrepSheetPage() {
  const [items, setItems] = useState<PrepItem[]>([])
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    const day = getDayOfWeek()
    setDayOfWeek(day)
    const prepItems = getPrepItemsForDay(day)
    setItems(prepItems)
  }, [])

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setCheckedItems(newChecked)
  }

  const handlePrint = () => {
    window.print()
  }

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category ?? 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, PrepItem[]>)

  const completedCount = checkedItems.size
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0

  return (
    <>
      {/* Screen Version */}
      <div className="print:hidden p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="display-md mb-2">Prep Sheet</h1>
            <p className="text-ink-400">{dayOfWeek} — {items.length} items</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="btn-secondary flex items-center gap-2"
            >
              <Printer size={18} />
              Print
            </button>
            <Link href="/prep" className="btn-secondary flex items-center gap-2">
              <Home size={18} />
              Back
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium">Progress</p>
            <p className="text-agave-300 font-bold">{Math.round(progress)}% ({completedCount}/{items.length})</p>
          </div>
          <div className="h-3 bg-ink-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-agave-300 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Prep Items */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="card">
              <h2 className="font-display font-bold text-lg mb-4 text-agave-300">{category}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-700">
                      <th className="text-left py-2 px-3"></th>
                      <th className="text-left py-2 px-3">ITEM</th>
                      <th className="text-left py-2 px-3">CONTAINER</th>
                      <th className="text-right py-2 px-3">PAR</th>
                      <th className="text-center py-2 px-3">ON HAND</th>
                      <th className="text-center py-2 px-3">MAKE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryItems.map((item) => {
                      const isChecked = checkedItems.has(item.id)
                      return (
                        <tr
                          key={item.id}
                          className={`border-b border-ink-700 hover:bg-ink-700/50 cursor-pointer ${
                            isChecked ? 'bg-agave-900/30' : ''
                          }`}
                        >
                          <td
                            className="text-center py-3 px-3"
                            onClick={() => toggleItem(item.id)}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleItem(item.id)}
                              className="cursor-pointer"
                            />
                          </td>
                          <td className={`py-3 px-3 ${isChecked ? 'line-through text-ink-500' : ''}`}>
                            {item.item}
                          </td>
                          <td className="py-3 px-3 text-ink-500 text-xs">{item.containerSize}</td>
                          <td className="text-right py-3 px-3 font-medium">{item.par}</td>
                          <td className="text-center py-3 px-3">
                            <input
                              type="text"
                              placeholder="—"
                              className="w-12 text-center text-sm"
                              disabled
                            />
                          </td>
                          <td className="text-center py-3 px-3">
                            <input
                              type="text"
                              placeholder="—"
                              className="w-12 text-center text-sm"
                              disabled
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print Version */}
      <div className="hidden print:block p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">EL PERRO NEGRO</h1>
          <h2 className="text-xl font-bold mb-1">PREP SHEET</h2>
          <p className="text-sm font-semibold">{dayOfWeek} — {new Date().toLocaleDateString()}</p>
        </div>

        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="mb-6 page-break">
            <h3 className="text-sm font-bold mb-2 border-b pb-1">{category}</h3>
            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1 px-1">ITEM</th>
                  <th className="text-left py-1 px-1">CONTAINER</th>
                  <th className="text-right py-1 px-1 w-8">PAR</th>
                  <th className="text-center py-1 px-1 w-10">ON HAND</th>
                  <th className="text-center py-1 px-1 w-10">MAKE</th>
                </tr>
              </thead>
              <tbody>
                {categoryItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-1 px-1">{item.item}</td>
                    <td className="py-1 px-1 text-xs text-gray-600">{item.containerSize}</td>
                    <td className="text-right py-1 px-1 font-semibold">{item.par}</td>
                    <td className="text-center py-1 px-1">
                      <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '30px' }}></span>
                    </td>
                    <td className="text-center py-1 px-1">
                      <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '30px' }}></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <style>{`
          @media print {
            body { margin: 0; padding: 0; }
            .page-break { page-break-inside: avoid; }
          }
        `}</style>
      </div>
    </>
  )
}
