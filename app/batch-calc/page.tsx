'use client'

import { useState, useEffect } from 'react'
import { Search, Save, Trash2, AlertCircle, Plus } from 'lucide-react'
import { getRecipes, getIngredients } from '@/lib/db'
import type { Recipe } from '@/lib/types'
import type { ScaledIngredient } from '@/lib/batch-types'
import Link from 'next/link'

interface RecipeWithDetails extends Recipe {
  ingredientDetails?: Array<{
    name: string
    unit: string
    amount: number
    costPerUnit: number
    totalCost: number
  }>
}

interface SavedBatch {
  id: string
  name: string
  recipeId: string
  recipeName: string
  multiplier: number
  yieldAmount?: number
  yieldUnit?: string
  notes?: string
}

export default function BatchCalcPage() {
  const [recipes, setRecipes] = useState<RecipeWithDetails[]>([])
  const [ingredients, setIngredients] = useState<any[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithDetails | null>(null)
  const [multiplier, setMultiplier] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [savedBatches, setSavedBatches] = useState<SavedBatch[]>([])
  const [batchName, setBatchName] = useState('')
  const [yieldAmount, setYieldAmount] = useState('')
  const [yieldUnit, setYieldUnit] = useState('oz')
  const [notes, setNotes] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)

  const COMMON_MULTIPLIERS = [0.5, 1, 2, 5, 10, 15, 20]
  const YIELD_UNITS = ['oz', 'ml', 'L', 'cups', 'bottles', 'batches', 'servings']

  useEffect(() => {
    loadData()
    loadSavedBatches()
  }, [])

  async function loadData() {
    try {
      setIsLoading(true)
      const [recipesData, ingredientsData] = await Promise.all([
        getRecipes(),
        getIngredients(),
      ])
      setRecipes(recipesData)
      setIngredients(ingredientsData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function loadSavedBatches() {
    const saved = localStorage.getItem('savedBatches')
    if (saved) {
      setSavedBatches(JSON.parse(saved))
    }
  }

  function saveBatch() {
    if (!batchName.trim() || !selectedRecipe) {
      setError('Please enter a batch name and select a recipe')
      return
    }

    const newBatch: SavedBatch = {
      id: Date.now().toString(),
      name: batchName,
      recipeId: selectedRecipe.id,
      recipeName: selectedRecipe.name,
      multiplier,
      yieldAmount: yieldAmount ? parseFloat(yieldAmount) : undefined,
      yieldUnit: yieldAmount ? yieldUnit : undefined,
      notes: notes || undefined,
    }

    const updated = [...savedBatches, newBatch]
    setSavedBatches(updated)
    localStorage.setItem('savedBatches', JSON.stringify(updated))

    setBatchName('')
    setYieldAmount('')
    setYieldUnit('oz')
    setNotes('')
    setShowSaveForm(false)
    setError('')
  }

  function deleteBatch(id: string) {
    const updated = savedBatches.filter(b => b.id !== id)
    setSavedBatches(updated)
    localStorage.setItem('savedBatches', JSON.stringify(updated))
  }

  function loadBatch(batch: SavedBatch) {
    const recipe = recipes.find(r => r.id === batch.recipeId)
    if (recipe) {
      handleRecipeSelect(recipe)
      setMultiplier(batch.multiplier)
    }
  }

  const handleRecipeSelect = (recipe: Recipe) => {
    const recipeWithDetails: RecipeWithDetails = {
      ...recipe,
      ingredientDetails: (recipe.components || []).map(comp => {
        const ingredient = ingredients.find(i => i.id === comp.ingredient_id)
        const costPerUnit = ingredient?.cost_per_unit || 0
        const totalCost = comp.amount * costPerUnit
        return {
          name: ingredient?.name || 'Unknown',
          unit: comp.unit,
          amount: comp.amount,
          costPerUnit,
          totalCost,
        }
      }),
    }
    setSelectedRecipe(recipeWithDetails)
  }

  const filteredRecipes = recipes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const scaledIngredients = selectedRecipe
    ? (selectedRecipe.ingredientDetails || []).map(ing => ({
        name: ing.name,
        unit: ing.unit,
        originalAmount: ing.amount,
        scaledAmount: ing.amount * multiplier,
        originalCost: ing.totalCost,
        scaledCost: ing.totalCost * multiplier,
        costPerUnit: ing.costPerUnit,
      }))
    : []

  const totalCost = scaledIngredients.reduce((sum, ing) => sum + ing.scaledCost, 0)
  const costPerBatch = selectedRecipe
    ? (selectedRecipe.ingredientDetails || []).reduce((sum, ing) => sum + ing.totalCost, 0)
    : 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="display-md mb-2">Batch Calculator</h1>
        <p className="text-ink-400">Scale recipes up or down and save batch formulations</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recipe Selection */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h2 className="font-display font-bold text-lg mb-4">Select Recipe</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-ink-500" size={18} />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>

            {isLoading ? (
              <p className="text-ink-400 text-center py-8">Loading recipes...</p>
            ) : filteredRecipes.length === 0 ? (
              <p className="text-ink-400 text-center py-8">No recipes found</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => handleRecipeSelect(recipe)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedRecipe?.id === recipe.id
                        ? 'bg-agave-300 text-ink-900 font-medium'
                        : 'bg-ink-700 text-ink-100 hover:bg-ink-600'
                    }`}
                  >
                    <p className="font-medium">{recipe.name}</p>
                    <p className="text-xs opacity-75">{recipe.category || 'Uncategorized'}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saved Batches */}
          {savedBatches.length > 0 && (
            <div className="card">
              <h3 className="font-display font-bold text-lg mb-4">Saved Batches</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedBatches.map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-3 bg-ink-700/50 rounded-md">
                    <button
                      onClick={() => loadBatch(batch)}
                      className="flex-1 text-left hover:text-agave-300 transition-colors"
                    >
                      <p className="font-medium text-sm">{batch.name}</p>
                      <p className="text-xs text-ink-400">×{batch.multiplier}</p>
                    </button>
                    <button
                      onClick={() => deleteBatch(batch.id)}
                      className="text-ink-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Batch Multiplier & Results */}
        {selectedRecipe ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Multiplier Selection */}
            <div className="card">
              <h2 className="font-display font-bold text-lg mb-4">{selectedRecipe.name}</h2>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="font-medium">Batch Multiplier</label>
                  <span className="text-agave-300 font-bold text-2xl">×{multiplier}</span>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={multiplier}
                  onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                  className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-agave-300"
                />

                <div className="flex gap-2 mt-4 flex-wrap">
                  {COMMON_MULTIPLIERS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMultiplier(m)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        multiplier === m
                          ? 'bg-agave-300 text-ink-900'
                          : 'bg-ink-700 text-ink-300 hover:bg-ink-600'
                      }`}
                    >
                      ×{m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-ink-700/50 p-4 rounded-md">
                  <p className="text-ink-400 text-sm mb-1">Per Batch</p>
                  <p className="text-xl font-bold text-agave-300">${costPerBatch.toFixed(2)}</p>
                </div>
                <div className="bg-ink-700/50 p-4 rounded-md">
                  <p className="text-ink-400 text-sm mb-1">Multiplier</p>
                  <p className="text-xl font-bold">×{multiplier}</p>
                </div>
                <div className="bg-agave-900/30 p-4 rounded-md border border-agave-300">
                  <p className="text-agave-300 text-sm mb-1">Total Cost</p>
                  <p className="text-xl font-bold text-agave-300">${totalCost.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Scaled Ingredients */}
            <div className="card">
              <h3 className="font-display font-bold text-lg mb-4">Scaled Ingredients (×{multiplier})</h3>

              <div className="space-y-3">
                {scaledIngredients.length === 0 ? (
                  <p className="text-ink-400 text-center py-8">No ingredients added to this recipe</p>
                ) : (
                  scaledIngredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-ink-700/50 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{ing.name}</p>
                        <p className="text-ink-400 text-sm">
                          {ing.scaledAmount.toFixed(2)} {ing.unit} (${ing.costPerUnit.toFixed(2)}/{ing.unit})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-agave-300">${ing.scaledCost.toFixed(2)}</p>
                        <p className="text-ink-400 text-xs">{ing.originalAmount.toFixed(2)} {ing.unit} base</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Save Batch */}
            <div className="card">
              {!showSaveForm ? (
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save This Batch
                </button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg">Save Batch Configuration</h3>

                  <div>
                    <label className="block text-sm font-medium mb-2">Batch Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Large Syrup Batch"
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Yield Amount</label>
                      <input
                        type="number"
                        placeholder="e.g., 64"
                        value={yieldAmount}
                        onChange={(e) => setYieldAmount(e.target.value)}
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Yield Unit</label>
                      <select value={yieldUnit} onChange={(e) => setYieldUnit(e.target.value)}>
                        {YIELD_UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <textarea
                      placeholder="e.g., For Tuesday prep, keep refrigerated"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button onClick={saveBatch} className="btn-primary flex-1">
                      Save Batch
                    </button>
                    <button onClick={() => setShowSaveForm(false)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Edit Recipe Link */}
            <div className="card bg-ink-700/50">
              <p className="text-ink-400 text-sm mb-3">Need to update ingredient amounts or costs?</p>
              <Link href={`/recipes/${selectedRecipe.id}`} className="btn-secondary w-full text-center">
                Edit Recipe & Ingredients
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 card text-center py-12">
            <p className="text-ink-400 mb-4">Select a recipe to start calculating batches</p>
            <Link href="/recipes/new" className="btn-primary">
              Create New Recipe
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
