'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipe = {
    id: params.id,
    name: 'Margarita',
    category: 'Tequila',
    instructions: 'Shake with ice and strain into a salt-rimmed glass',
    components: [
      { name: 'Tequila Blanco', amount: 2, unit: 'oz', cost: 4.00 },
      { name: 'Lime Juice', amount: 1, unit: 'oz', cost: 0.30 },
      { name: 'Agave Nectar', amount: 0.5, unit: 'oz', cost: 0.20 },
    ],
  }

  const totalCost = recipe.components.reduce((sum, c) => sum + c.cost, 0)

  return (
    <div className="p-8">
      <Link href="/recipes" className="flex items-center gap-2 text-agave-300 hover:text-agave-200 mb-8">
        <ArrowLeft size={18} />
        Back to Recipes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <h1 className="display-md mb-2">{recipe.name}</h1>
            <p className="text-agave-300 text-lg mb-6">{recipe.category}</p>
            
            <div className="mb-6">
              <h2 className="font-display font-bold text-lg mb-3">Instructions</h2>
              <p className="text-ink-300">{recipe.instructions}</p>
            </div>

            <div>
              <h2 className="font-display font-bold text-lg mb-4">Components</h2>
              <div className="space-y-3">
                {recipe.components.map((comp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-ink-700/50 rounded-md">
                    <div>
                      <p className="font-medium">{comp.name}</p>
                      <p className="text-ink-400 text-sm">{comp.amount} {comp.unit}</p>
                    </div>
                    <p className="text-agave-300 font-medium">${comp.cost.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card sticky top-8">
            <div className="mb-6 p-4 bg-agave-900 rounded-md">
              <p className="text-agave-300 text-sm mb-1">Pour Cost</p>
              <p className="display-md text-agave-300">${totalCost.toFixed(2)}</p>
            </div>

            <div className="space-y-3">
              <button className="btn-primary w-full">Edit Recipe</button>
              <button className="btn-secondary w-full">Print Spec Card</button>
              <button className="btn-secondary w-full">Batch Calculator</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
