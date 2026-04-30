'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Printer, Home } from 'lucide-react'
import { CLOSING_CHECKLIST, getDayOfWeekName, getSideworkTask } from '@/lib/shift-checklists'
import Link from 'next/link'

export default function ClosingChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [initials, setInitials] = useState('')
  const [notes, setNotes] = useState({
    broken: '',
    missing: '',
    lowStock: '',
  })
  const [dayOfWeek, setDayOfWeek] = useState('')

  useEffect(() => {
    setDayOfWeek(getDayOfWeekName())
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

  const completedCount = checkedItems.size
  const totalCount = CLOSING_CHECKLIST.items.length
  const progress = (completedCount / totalCount) * 100

  const sidework = getSideworkTask('closing', dayOfWeek)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-md mb-2">Closing Checklist</h1>
          <p className="text-ink-400">{dayOfWeek} — {completedCount}/{totalCount} completed</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
            <Printer size={18} />
            Print
          </button>
          <Link href="/checklists" className="btn-secondary flex items-center gap-2">
            <Home size={18} />
            Back
          </Link>
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium">Progress</p>
          <p className="text-agave-300 font-bold">{Math.round(progress)}%</p>
        </div>
        <div className="h-3 bg-ink-700 rounded-full overflow-hidden">
          <div className="h-full bg-agave-300 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <label className="block text-sm font-medium mb-2">Staff Initials</label>
          <input
            type="text"
            placeholder="e.g., JD"
            value={initials}
            onChange={(e) => setInitials(e.target.value.toUpperCase())}
            maxLength={3}
            className="uppercase"
          />
        </div>
        <div className="card">
          <label className="block text-sm font-medium mb-2">Broken Items</label>
          <textarea
            placeholder="Note any broken items..."
            value={notes.broken}
            onChange={(e) => setNotes({...notes, broken: e.target.value})}
            rows={2}
          />
        </div>
        <div className="card">
          <label className="block text-sm font-medium mb-2">Missing Items</label>
          <textarea
            placeholder="Note any missing items..."
            value={notes.missing}
            onChange={(e) => setNotes({...notes, missing: e.target.value})}
            rows={2}
          />
        </div>
      </div>

      <div className="card mb-8">
        <label className="block text-sm font-medium mb-2">Low Stock Items</label>
        <textarea
          placeholder="Note any low stock items..."
          value={notes.lowStock}
          onChange={(e) => setNotes({...notes, lowStock: e.target.value})}
          rows={3}
        />
      </div>

      <div className="space-y-3 mb-8">
        {CLOSING_CHECKLIST.items.map((item) => {
          const isChecked = checkedItems.has(item.id)
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`card-sm flex items-center gap-4 cursor-pointer transition-colors hover:bg-ink-700 ${
                isChecked ? 'bg-agave-900/30' : ''
              }`}
            >
              <button onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }} className="flex-shrink-0">
                {isChecked ? (
                  <CheckCircle2 size={24} className="text-agave-300" />
                ) : (
                  <Circle size={24} className="text-ink-500" />
                )}
              </button>
              <p className={isChecked ? 'line-through text-ink-500' : ''}>{item.task}</p>
            </div>
          )
        })}
      </div>

      <div className="card border-agave-300/50">
        <h2 className="font-display font-bold text-lg mb-4 text-agave-300">Weekly Sidework</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => toggleItem('sidework')} className="flex-shrink-0">
            {checkedItems.has('sidework') ? (
              <CheckCircle2 size={24} className="text-agave-300" />
            ) : (
              <Circle size={24} className="text-ink-500" />
            )}
          </button>
          <p className={checkedItems.has('sidework') ? 'line-through text-ink-500' : 'font-medium'}>{sidework}</p>
        </div>
      </div>
    </div>
  )
}
