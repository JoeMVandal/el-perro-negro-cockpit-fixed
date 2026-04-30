'use client'

import { CheckCircle2, Circle, Plus, Trash2, AlertCircle, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getPrepList, togglePrepListItem, deletePrepListItem, getRecipes } from '@/lib/db'
import { getDayOfWeek } from '@/lib/prep-templates'
import type { PrepListItem, Recipe } from '@/lib/types'
import Link from 'next/link'

export default function PrepPage() {
  const [prepItems, setPrepItems] = useState<PrepListItem[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('')

  useEffect(() => {
    loadData()
    setDayOfWeek(getDayOfWeek())
  }, [])

  async function loadData() {
    try {
      setIsLoading(true)
      const [prepData, recipeData] = await Promise.all([
        getPrepList(),
        getRecipes(),
      ])
      setPrepItems(prepData)
      setRecipes(recipeData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggle(id: string, completed: boolean) {
    try {
      await togglePrepListItem(id, !completed)
      setPrepItems(prepItems.map(item =>
        item.id === id
          ? { ...item, completed: !completed, completed_at: !completed ? new Date().toISOString() : null }
          : item
      ))
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePrepListItem(id)
      setPrepItems(prepItems.filter(item => item.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const completedCount = prepItems.filter(i => i.completed).length

  const getRecipeName = (recipeId: string) => {
    return recipes.find(r => r.id === recipeId)?.name || 'Unknown Recipe'
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-md mb-2">Prep Lists</h1>
          <p className="text-ink-400">{completedCount} of {prepItems.length} items completed</p>
        </div>
        <div className="flex gap-3">
          <Link href="/prep-sheet" className="btn-primary flex items-center gap-2">
            <FileText size={18} />
            {dayOfWeek} Sheet
          </Link>
          <button className="btn-secondary flex items-center gap-2">
            <Plus size={18} />
            New Item
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="card text-center py-12">
          <p className="text-ink-400">Loading prep list...</p>
        </div>
      ) : prepItems.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-ink-400 mb-4">No prep tasks yet</p>
          <p className="text-sm text-ink-500 mb-6">Your custom prep items will appear here</p>
          <Link href="/prep-sheet" className="btn-primary">
            View {dayOfWeek} Prep Sheet
          </Link>
        </div>
      ) : (
        <>
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-3">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <p className="font-medium">Today's Progress</p>
              <p className="text-agave-300 font-bold">{Math.round((completedCount / prepItems.length) * 100)}%</p>
            </div>
            <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-agave-300 transition-all"
                style={{ width: `${(completedCount / prepItems.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {prepItems.map((item) => (
              <div key={item.id} className="card-sm flex items-center gap-4 hover:bg-ink-700 transition-colors">
                <button 
                  onClick={() => handleToggle(item.id, item.completed)}
                  className="flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                  {item.completed ? (
                    <CheckCircle2 size={24} className="text-agave-300" />
                  ) : (
                    <Circle size={24} className="text-ink-500" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={item.completed ? 'text-ink-500 line-through' : 'font-medium'}>
                    {getRecipeName(item.recipe_id)}
                  </p>
                  {item.completed_at && (
                    <p className="text-ink-500 text-sm">
                      Completed at {new Date(item.completed_at).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-ink-500 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
