'use client'

import { Plus, Search, Trash2, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getRecipes, deleteRecipe } from '@/lib/db'
import type { Recipe } from '@/lib/types'
import Link from 'next/link'

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRecipes()
  }, [])

  async function loadRecipes() {
    try {
      setIsLoading(true)
      const data = await getRecipes()
      setRecipes(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this recipe? This action cannot be undone.')) return

    try {
      await deleteRecipe(id)
      setRecipes(recipes.filter(r => r.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const filteredRecipes = recipes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-md mb-2">Recipes</h1>
          <p className="text-ink-400">Manage cocktail recipes and costing</p>
        </div>
        <Link href="/recipes/new" className="btn-primary">
          <Plus size={18} />
          New Recipe
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-ink-500" size={18} />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="card text-center py-12">
          <p className="text-ink-400">Loading recipes...</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-ink-400 mb-4">No recipes yet</p>
          <Link href="/recipes/new" className="btn-primary">
            Create your first recipe
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-700">
                <th className="px-6 py-3 text-left text-sm font-medium text-ink-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-ink-300">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-ink-300">Components</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-ink-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => (
                <tr key={recipe.id} className="border-b border-ink-700 hover:bg-ink-700/50">
                  <td className="px-6 py-4 font-medium">{recipe.name}</td>
                  <td className="px-6 py-4 text-ink-400 text-sm">{recipe.category || '-'}</td>
                  <td className="px-6 py-4 text-ink-400">{recipe.components?.length || 0} items</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/recipes/${recipe.id}`} className="text-agave-300 hover:text-agave-200">
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="text-ink-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
