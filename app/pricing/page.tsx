'use client'

import { useState, useEffect } from 'react'
import { ProtectedLayout } from '@/components/ProtectedLayout'
import { getRecipes, getIngredients } from '@/lib/db'
import { DollarSign, Search, TrendingUp } from 'lucide-react'

interface Recipe {
  id: string
  name: string
  description?: string
  base_spirit?: string
}

interface Ingredient {
  id: string
  name: string
  cost_per_oz: number
}

interface RecipeComponent {
  ingredient_id: string
  amount_oz: number
}

interface PricingResult {
  recipes: Recipe[]
  ingredients: Ingredient[]
}

export default function PricingPage() {
  const [selectedTab, setSelectedTab] = useState<'cocktail' | 'batch'>('cocktail')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [recipesData, ingredientsData] = await Promise.all([
          getRecipes(),
          getIngredients(),
        ])
        setRecipes(recipesData || [])
        setIngredients(ingredientsData || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display text-ink-900 mb-2">
              Pricing Calculators
            </h1>
            <p className="text-slate-600">
              Calculate COGS and menu pricing for cocktails and batches
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-slate-200">
            <button
              onClick={() => setSelectedTab('cocktail')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                selectedTab === 'cocktail'
                  ? 'text-agave-600 border-agave-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Cocktail Pricing
            </button>
            <button
              onClick={() => setSelectedTab('batch')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                selectedTab === 'batch'
                  ? 'text-agave-600 border-agave-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Batch Pricing
            </button>
          </div>

          {/* Cocktail Pricing */}
          {selectedTab === 'cocktail' && (
            <CocktailPricingCalculator
              recipes={filteredRecipes}
              ingredients={ingredients}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading}
            />
          )}

          {/* Batch Pricing */}
          {selectedTab === 'batch' && (
            <BatchPricingCalculator
              recipes={filteredRecipes}
              ingredients={ingredients}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading}
            />
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}

function CocktailPricingCalculator({
  recipes,
  ingredients,
  searchTerm,
  setSearchTerm,
  loading,
}: {
  recipes: Recipe[]
  ingredients: Ingredient[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  loading: boolean
}) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('')
  const [recipeComponents, setRecipeComponents] = useState<RecipeComponent[]>([])
  const [margin, setMargin] = useState(70) // 70% margin = 41% cost
  const [customCogs, setCustomCogs] = useState(0)

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId)

  useEffect(() => {
    const loadRecipeComponents = async () => {
      if (!selectedRecipeId) {
        setRecipeComponents([])
        return
      }
      try {
        const response = await fetch(`/api/recipes/${selectedRecipeId}/components`)
        const data = await response.json()
        setRecipeComponents(data || [])
        setCustomCogs(0)
      } catch (error) {
        console.error('Error loading recipe components:', error)
      }
    }
    loadRecipeComponents()
  }, [selectedRecipeId])

  // Calculate COGS
  const cogs = recipeComponents.reduce((total, component) => {
    const ingredient = ingredients.find((i) => i.id === component.ingredient_id)
    return total + (ingredient?.cost_per_oz || 0) * component.amount_oz
  }, 0)

  const totalCogs = customCogs > 0 ? customCogs : cogs

  // Calculate pricing
  const cost_percentage = (totalCogs / (totalCogs * (1 + margin / 100))) * 100
  const suggested_price = totalCogs / (1 - cost_percentage / 100)
  const profit_per_drink = suggested_price - totalCogs

  const presetMargins = [50, 60, 70, 80, 90, 100]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-ink-900 mb-6 flex items-center gap-2">
          <Search className="w-5 h-5 text-agave-600" />
          Select Cocktail
        </h2>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
          />
        </div>

        {/* Recipe List */}
        <div className="mb-6 max-h-80 overflow-y-auto border border-slate-200 rounded-lg">
          {loading ? (
            <div className="p-4 text-center text-slate-500">Loading recipes...</div>
          ) : recipes.length === 0 ? (
            <div className="p-4 text-center text-slate-500">No recipes found</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    selectedRecipeId === recipe.id
                      ? 'bg-agave-50 border-l-2 border-agave-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <p className="font-semibold text-slate-900">{recipe.name}</p>
                  {recipe.base_spirit && (
                    <p className="text-xs text-slate-500">{recipe.base_spirit}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Margin Slider */}
        {selectedRecipeId && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Target Margin: {margin}%
              </label>
              <input
                type="range"
                min="30"
                max="150"
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-agave-600"
              />
              <div className="grid grid-cols-3 gap-2 mt-3">
                {presetMargins.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMargin(m)}
                    className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                      margin === m
                        ? 'bg-agave-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {m}%
                  </button>
                ))}
              </div>
            </div>

            {/* Manual COGS Override */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Override COGS (optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={customCogs || ''}
                onChange={(e) => setCustomCogs(parseFloat(e.target.value) || 0)}
                placeholder="Leave blank to calculate from ingredients"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">For additional costs (ice, garnish, etc.)</p>
            </div>
          </>
        )}
      </div>

      {/* Results */}
      {selectedRecipeId && (
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-ink-900 mb-4 uppercase tracking-wide">
                Cost Breakdown
              </h3>
              <div className="space-y-3">
                {recipeComponents.length > 0 && (
                  <>
                    {recipeComponents.map((component) => {
                      const ingredient = ingredients.find((i) => i.id === component.ingredient_id)
                      const cost = (ingredient?.cost_per_oz || 0) * component.amount_oz
                      return (
                        <div key={component.ingredient_id} className="flex justify-between text-sm">
                          <span className="text-slate-600">
                            {ingredient?.name} ({component.amount_oz.toFixed(2)} oz)
                          </span>
                          <span className="font-medium text-slate-900">
                            ${cost.toFixed(2)}
                          </span>
                        </div>
                      )
                    })}
                    <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold">
                      <span>Subtotal</span>
                      <span className="text-agave-600">${cogs.toFixed(2)}</span>
                    </div>
                  </>
                )}
                {customCogs > 0 && (
                  <div className="flex justify-between text-sm bg-blue-50 p-2 rounded">
                    <span className="text-blue-900">Additional Costs</span>
                    <span className="font-medium text-blue-900">${customCogs.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold">
                  <span>Total COGS</span>
                  <span className="text-agave-700">${totalCogs.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-agave-50 rounded-lg p-6 border-2 border-agave-200">
              <h3 className="text-sm font-semibold text-agave-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Pricing
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-agave-700 mb-1">COGS as % of Price</p>
                  <p className="text-3xl font-bold text-agave-900">
                    {cost_percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-agave-700 mt-1">
                    (Margin: {(100 - cost_percentage).toFixed(1)}%)
                  </p>
                </div>

                <div className="bg-white rounded p-3 border border-agave-200">
                  <p className="text-xs text-agave-700 mb-1">Suggested Menu Price</p>
                  <p className="text-4xl font-bold text-agave-900">
                    ${suggested_price.toFixed(2)}
                  </p>
                </div>

                <div className="bg-green-50 rounded p-3 border border-green-200">
                  <p className="text-xs text-green-700 mb-1">Profit per Drink</p>
                  <p className="text-2xl font-bold text-green-700">
                    ${profit_per_drink.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Price Tiers */}
              <div className="mt-6 pt-6 border-t-2 border-agave-200">
                <p className="text-xs font-semibold text-agave-900 mb-3">ALTERNATIVE PRICING</p>
                <div className="space-y-2 text-sm">
                  {[40, 45, 50].map((target) => {
                    const alt_price = totalCogs / (1 - target / 100)
                    const alt_profit = alt_price - totalCogs
                    return (
                      <div key={target} className="flex justify-between">
                        <span className="text-agave-700">{target}% cost</span>
                        <div className="text-right">
                          <p className="font-semibold text-agave-900">${alt_price.toFixed(2)}</p>
                          <p className="text-xs text-agave-600">+${alt_profit.toFixed(2)} profit</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200 text-sm text-blue-900">
            <p className="font-semibold mb-1">💡 Pricing Tips</p>
            <ul className="text-xs space-y-1 text-blue-900">
              <li>• Standard bar margin is 70-80% (28-33% cost)</li>
              <li>• Premium cocktails: 60-70% margin (37-45% cost)</li>
              <li>• High-volume well drinks: 80-100% margin (17-28% cost)</li>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <li>• Use "Override COGS" to add garnish, ice, and glassware costs</li>
            </ul>
          </div>
        </div>
      )}

      {!selectedRecipeId && (
        <div className="lg:col-span-2 bg-slate-50 rounded-lg p-8 border border-dashed border-slate-300 flex items-center justify-center min-h-96">
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 mb-1">Select a cocktail to calculate pricing</p>
            <p className="text-sm text-slate-400">Search or scroll to find your recipe</p>
          </div>
        </div>
      )}
    </div>
  )
}

function BatchPricingCalculator({
  recipes,
  ingredients,
  searchTerm,
  setSearchTerm,
  loading,
}: {
  recipes: Recipe[]
  ingredients: Ingredient[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  loading: boolean
}) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('')
  const [recipeComponents, setRecipeComponents] = useState<RecipeComponent[]>([])
  const [batchMultiplier, setBatchMultiplier] = useState(1)
  const [yieldAmount, setYieldAmount] = useState(1)
  const [yieldUnit, setYieldUnit] = useState('L')
  const [markup, setMarkup] = useState(100) // 100% markup = 50% profit

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId)

  useEffect(() => {
    const loadRecipeComponents = async () => {
      if (!selectedRecipeId) {
        setRecipeComponents([])
        return
      }
      try {
        const response = await fetch(`/api/recipes/${selectedRecipeId}/components`)
        const data = await response.json()
        setRecipeComponents(data || [])
      } catch (error) {
        console.error('Error loading recipe components:', error)
      }
    }
    loadRecipeComponents()
  }, [selectedRecipeId])

  // Calculate batch cost
  const batchCost = recipeComponents.reduce((total, component) => {
    const ingredient = ingredients.find((i) => i.id === component.ingredient_id)
    return total + (ingredient?.cost_per_oz || 0) * component.amount_oz * batchMultiplier
  }, 0)

  const costPerUnit = yieldAmount > 0 ? batchCost / yieldAmount : 0
  const sellingPricePerUnit = costPerUnit * (1 + markup / 100)
  const profitPerUnit = sellingPricePerUnit - costPerUnit
  const totalProfit = profitPerUnit * yieldAmount

  const presetMarkups = [50, 75, 100, 150, 200]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-ink-900 mb-6 flex items-center gap-2">
          <Search className="w-5 h-5 text-agave-600" />
          Select Recipe & Batch
        </h2>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
          />
        </div>

        {/* Recipe List */}
        <div className="mb-6 max-h-56 overflow-y-auto border border-slate-200 rounded-lg">
          {loading ? (
            <div className="p-4 text-center text-slate-500">Loading recipes...</div>
          ) : recipes.length === 0 ? (
            <div className="p-4 text-center text-slate-500">No recipes found</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    selectedRecipeId === recipe.id
                      ? 'bg-agave-50 border-l-2 border-agave-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <p className="font-semibold text-slate-900">{recipe.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedRecipeId && (
          <>
            {/* Batch Multiplier */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Batch Multiplier: {batchMultiplier}x
              </label>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={batchMultiplier}
                onChange={(e) => setBatchMultiplier(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-agave-600"
              />
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[0.5, 1, 2, 5, 10, 15, 20].map((m) => (
                  <button
                    key={m}
                    onClick={() => setBatchMultiplier(m)}
                    className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                      batchMultiplier === m
                        ? 'bg-agave-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {m}x
                  </button>
                ))}
              </div>
            </div>

            {/* Yield */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Batch Yield
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={yieldAmount}
                  onChange={(e) => setYieldAmount(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
                />
                <select
                  value={yieldUnit}
                  onChange={(e) => setYieldUnit(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent bg-white"
                >
                  <option>L</option>
                  <option>gal</option>
                  <option>oz</option>
                  <option>bottles</option>
                  <option>servings</option>
                </select>
              </div>
            </div>

            {/* Markup */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Markup: {markup}%
              </label>
              <input
                type="range"
                min="0"
                max="300"
                value={markup}
                onChange={(e) => setMarkup(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-agave-600"
              />
              <div className="grid grid-cols-3 gap-2 mt-3">
                {presetMarkups.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMarkup(m)}
                    className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                      markup === m
                        ? 'bg-agave-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {m}%
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Results */}
      {selectedRecipeId && (
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cost Summary */}
            <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-ink-900 mb-4 uppercase tracking-wide">
                Batch Costs
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Total Batch Cost</p>
                  <p className="text-3xl font-bold text-slate-900">${batchCost.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Cost per Unit</p>
                  <p className="text-2xl font-bold text-slate-900">${costPerUnit.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {yieldAmount} {yieldUnit}
                  </p>
                </div>
                <div className="text-sm text-slate-600 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-2">Batch Details:</p>
                  <p>Multiplier: {batchMultiplier}x</p>
                  <p>Yield: {yieldAmount} {yieldUnit}</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-agave-50 rounded-lg p-6 border-2 border-agave-200">
              <h3 className="text-sm font-semibold text-agave-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Retail Pricing
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-agave-700 mb-1">Price per Unit ({markup}% markup)</p>
                  <p className="text-3xl font-bold text-agave-900">
                    ${sellingPricePerUnit.toFixed(2)}
                  </p>
                </div>

                <div className="bg-green-50 rounded p-3 border border-green-200">
                  <p className="text-xs text-green-700 mb-1">Profit per Unit</p>
                  <p className="text-2xl font-bold text-green-700">
                    ${profitPerUnit.toFixed(2)}
                  </p>
                </div>

                <div className="bg-white rounded p-3 border border-agave-200">
                  <p className="text-xs text-agave-700 mb-1">Total Profit (Batch)</p>
                  <p className="text-2xl font-bold text-agave-900">
                    ${totalProfit.toFixed(2)}
                  </p>
                  <p className="text-xs text-agave-600 mt-1">
                    {yieldAmount > 0 && `${yieldAmount} units × $${profitPerUnit.toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredient Breakdown */}
          {recipeComponents.length > 0 && (
            <div className="mt-6 bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-ink-900 mb-4 uppercase tracking-wide">
                Ingredient Breakdown ({batchMultiplier}x Batch)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipeComponents.map((component) => {
                  const ingredient = ingredients.find((i) => i.id === component.ingredient_id)
                  const scaledAmount = component.amount_oz * batchMultiplier
                  const cost = (ingredient?.cost_per_oz || 0) * scaledAmount
                  return (
                    <div key={component.ingredient_id} className="border border-slate-200 p-3 rounded">
                      <p className="font-semibold text-slate-900">{ingredient?.name}</p>
                      <div className="flex justify-between text-sm text-slate-600 mt-1">
                        <span>{scaledAmount.toFixed(2)} oz</span>
                        <span className="font-medium">${cost.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        @ ${ingredient?.cost_per_oz.toFixed(2)}/oz
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedRecipeId && (
        <div className="lg:col-span-2 bg-slate-50 rounded-lg p-8 border border-dashed border-slate-300 flex items-center justify-center min-h-96">
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 mb-1">Select a recipe to calculate batch pricing</p>
            <p className="text-sm text-slate-400">Search or scroll to find your recipe</p>
          </div>
        </div>
      )}
    </div>
  )
}
