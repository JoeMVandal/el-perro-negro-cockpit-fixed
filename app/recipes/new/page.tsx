'use client'

import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRecipe } from '@/lib/db'

export default function NewRecipePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tequila',
    base_spirit: '',
    instructions: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Recipe name is required')
      return
    }

    try {
      setIsLoading(true)
      const recipe = await createRecipe({
        name: formData.name,
        category: formData.category,
        base_spirit: formData.base_spirit || undefined,
        instructions: formData.instructions || undefined,
        components: [],
        pour_cost: 0,
      })
      
      router.push(`/recipes/${recipe.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <Link href="/recipes" className="flex items-center gap-2 text-agave-300 hover:text-agave-200 mb-8">
        <ArrowLeft size={18} />
        Back to Recipes
      </Link>

      <div className="max-w-2xl">
        <div className="card">
          <h1 className="display-md mb-8">Create New Recipe</h1>

          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Recipe Name *</label>
              <input
                type="text"
                placeholder="e.g., Margarita, Paloma, etc."
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  disabled={isLoading}
                >
                  <option>Tequila</option>
                  <option>Mezcal</option>
                  <option>Gin</option>
                  <option>Rum</option>
                  <option>Vodka</option>
                  <option>Whiskey</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Base Spirit</label>
                <input
                  type="text"
                  placeholder="e.g., Tequila Blanco"
                  value={formData.base_spirit}
                  onChange={(e) => setFormData({...formData, base_spirit: e.target.value})}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Instructions</label>
              <textarea
                rows={6}
                placeholder="How to make this drink..."
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Creating...' : 'Create Recipe'}
              </button>
              <Link href="/recipes" className="btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
