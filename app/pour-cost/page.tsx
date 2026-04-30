'use client'

import { useState, useEffect } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { getRecipes, getIngredients } from '@/lib/db'
import type { Recipe } from '@/lib/types'
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

export default function PourCostPage() {
  const [recipes, setRecipes] = useState<RecipeWithDetails[]>([])
  const [ingredients, setIngredients] = useState<any[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithDetails | null>(null)
  const [pourSize, setPourSize] = useState(2) // oz
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const POUR_SIZES = [0.5, 0.75, 1, 1.5, 2, 2.5, 3]

  useEffect(() => {
    loadData()
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
    setPourSize(2)
  }

  const filteredRecipes = recipes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const basePourCost = selectedRecipe
    ? (selectedRecipe.ingredientDetails || []).reduce((sum, comp) => sum + comp.totalCost, 0)
    : 0

  const adjustedPourCost = (basePourCost / 2) * pourSize // Base cost is for 2 oz

  const costPerOz = basePourCost / 2

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="display-md mb-2">Pour Cost Calculator</h1>
        <p className="text-ink-400">Calculate drink costs by adjustable pour size</p>
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
        </div>

        {/* Pour Cost Calculator */}
        {selectedRecipe ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Recipe Info */}
            <div className="card">
              <h2 className="font-display font-bold text-lg mb-4">{selectedRecipe.name}</h2>

              {/* Pour Size Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="font-medium">Pour Size</label>
                  <span className="text-agave-300 font-bold text-2xl">{pourSize} oz</span>
                </div>

                {/* Visual Slider */}
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={pourSize}
                  onChange={(e) => setPourSize(parseFloat(e.target.value))}
                  className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-agave-300"
                />

                {/* Quick Select Buttons */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {POUR_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setPourSize(size)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pourSize === size
                          ? 'bg-agave-300 text-ink-900'
                          : 'bg-ink-700 text-ink-300 hover:bg-ink-600'
                      }`}
                    >
                      {size} oz
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-ink-700/50 p-4 rounded-md">
                  <p className="text-ink-400 text-sm mb-1">Cost per Oz</p>
                  <p className="text-2xl font-bold text-agave-300">${costPerOz.toFixed(2)}</p>
                </div>
                <div className="bg-ink-700/50 p-4 rounded-md">
                  <p className="text-ink-400 text-sm mb-1">Pour Cost ({pourSize} oz)</p>
                  <p className="text-2xl font-bold text-agave-300">${adjustedPourCost.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Ingredient Breakdown */}
            <div className="card">
              <h3 className="font-display font-bold text-lg mb-4">Ingredient Breakdown</h3>

              <div className="space-y-3">
                {(selectedRecipe.ingredientDetails || []).length === 0 ? (
                  <p className="text-ink-400 text-center py-8">No ingredients added to this recipe</p>
                ) : (
                  (selectedRecipe.ingredientDetails || []).map((ing, idx) => {
                    const adjustedAmount = (ing.amount / 2) * pourSize
                    const adjustedCost = ing.totalCost / 2 * pourSize
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-ink-700/50 rounded-md">
                        <div className="flex-1">
                          <p className="font-medium">{ing.name}</p>
                          <p className="text-ink-400 text-sm">
                            {adjustedAmount.toFixed(2)} {ing.unit} @ ${ing.costPerUnit.toFixed(2)}/{ing.unit}
                          </p>
                        </div>
                        <p className="font-bold text-agave-300">${adjustedCost.toFixed(2)}</p>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Cost Percentage */}
              <div className="mt-6 p-4 bg-agave-900/20 rounded-md border border-agave-300/30">
                <p className="text-ink-400 text-sm mb-2">Pour Cost Analysis</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium">${adjustedPourCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suggested Price (4x cost):</span>
                    <span className="font-bold text-agave-300">${(adjustedPourCost * 4).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin at 4x:</span>
                    <span className="font-bold text-agave-300">{(75).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add/Edit Recipe Link */}
            <div className="card bg-ink-700/50">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <p className="text-ink-400 text-sm mb-3">Need to update this recipe's ingredients or costs?</p>
              <Link href={`/recipes/${selectedRecipe.id}`} className="btn-secondary w-full text-center">
                Edit Recipe & Ingredients
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 card text-center py-12">
            <p className="text-ink-400 mb-4">Select a recipe to see pour costs</p>
            <Link href="/recipes/new" className="btn-primary">
              Create New Recipe
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
