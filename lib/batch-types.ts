export interface BatchConfig {
  id: string
  name: string
  recipeId: string
  recipeName: string
  batchMultiplier: number
  yield?: {
    amount: number
    unit: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ScaledIngredient {
  ingredientId: string
  name: string
  originalAmount: number
  originalUnit: string
  scaledAmount: number
  scaledUnit: string
  costPerUnit: number
  originalCost: number
  scaledCost: number
}

export interface BatchCalculation {
  recipeName: string
  batchMultiplier: number
  ingredients: ScaledIngredient[]
  totalCost: number
  costPerBatch: number
  yield?: {
    amount: number
    unit: string
    costPerUnit: number
  }
}
