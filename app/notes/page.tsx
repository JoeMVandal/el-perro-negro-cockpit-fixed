'use client'

import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getStaffNotes, createStaffNote, deleteStaffNote, getCurrentUser } from '@/lib/db'
import type { StaffNote } from '@/lib/types'

export default function NotesPage() {
  const [notes, setNotes] = useState<StaffNote[]>([])
  const [newNote, setNewNote] = useState('')
  const [category, setCategory] = useState('General')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadNotes()
  }, [])

  async function loadNotes() {
    try {
      setIsLoading(true)
      const data = await getStaffNotes()
      setNotes(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault()
    if (!newNote.trim()) return

    try {
      setIsSaving(true)
      const user = await getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const note = await createStaffNote({
        content: newNote,
        created_by: user.id,
        category,
      })

      setNotes([note, ...notes])
      setNewNote('')
      setCategory('General')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteStaffNote(id)
      setNotes(notes.filter(n => n.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-md mb-2">Staff Notes</h1>
          <p className="text-ink-400">Team communication and reminders</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="card mb-8">
        <h2 className="font-display font-bold text-lg mb-4">Post a Note</h2>
        <form onSubmit={handleAddNote} className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            disabled={isSaving}
          />
          <div className="flex gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSaving}
            >
              <option>General</option>
              <option>Inventory</option>
              <option>Staff</option>
              <option>Equipment</option>
              <option>Urgent</option>
            </select>
            <button
              type="submit"
              disabled={isSaving || !newNote.trim()}
              className="btn-primary"
            >
              {isSaving ? 'Posting...' : 'Post Note'}
            </button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="card text-center py-12">
          <p className="text-ink-400">Loading notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-ink-400">No notes yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-ink-100 mb-2">{note.content}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm text-ink-400">by {note.created_by}</span>
                    {note.category && (
                      <span className="badge badge-agave">{note.category}</span>
                    )}
                    <span className="text-sm text-ink-500">
                      {new Date(note.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-ink-500 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
