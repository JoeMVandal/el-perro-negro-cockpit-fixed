'use client'

import { useState } from 'react'
import { ProtectedLayout } from '@/components/ProtectedLayout'
import { Beaker, Plus, Trash2, Zap } from 'lucide-react'

interface IngredientLine {
  id: string
  name: string
  volume: number
  abv: number
  unit: 'oz' | 'ml' | 'L'
}

export default function ABVCalcPage() {
  const [mode, setMode] = useState<'mixer' | 'dilute' | 'proof'>('mixer')
  const [ingredients, setIngredients] = useState<IngredientLine[]>([
    { id: '1', name: 'Bourbon', volume: 2, abv: 40, unit: 'oz' },
    { id: '2', name: 'Lemon Juice', volume: 0.75, abv: 0, unit: 'oz' },
  ])
  const [resultAbv, setResultAbv] = useState(0)
  const [resultVolume, setResultVolume] = useState(0)
  const [resultAlcohol, setResultAlcohol] = useState(0)

  // Mode: Dilution to target
  const [dilutionSpirit, setDilutionSpirit] = useState({
    volume: 2,
    abv: 40,
    unit: 'oz' as 'oz' | 'ml' | 'L',
  })
  const [targetAbv, setTargetAbv] = useState(15)
  const [dilutionAmount, setDilutionAmount] = useState(0)

  // Mode: Proof mixing
  const [proof1, setProof1] = useState(80)
  const [volume1, setVolume1] = useState(1)
  const [proof2, setProof2] = useState(40)
  const [volume2, setVolume2] = useState(1)

  const unitConversions: Record<string, number> = {
    oz: 0.0295735, // to liters
    ml: 0.001,
    L: 1,
  }

  // Calculate mixer mode (multiple ingredients)
  const calculateMixer = () => {
    let totalAlcoholLiters = 0
    let totalVolumeLiters = 0

    ingredients.forEach((ing) => {
      const volumeLiters = ing.volume * (unitConversions[ing.unit] ?? 1)
      const alcoholLiters = volumeLiters * (ing.abv / 100)
      totalAlcoholLiters += alcoholLiters
      totalVolumeLiters += volumeLiters
    })

    const abv = totalVolumeLiters > 0 ? (totalAlcoholLiters / totalVolumeLiters) * 100 : 0
    setResultAbv(abv)
    setResultVolume(totalVolumeLiters)
    setResultAlcohol(totalAlcoholLiters)
  }

  // Calculate dilution mode
  const calculateDilution = () => {
    const spiritVolumeLiters = dilutionSpirit.volume * (unitConversions[dilutionSpirit.unit] ?? 1)
    const alcoholLiters = spiritVolumeLiters * (dilutionSpirit.abv / 100)

    // To get target ABV: (alcohol / (spirit + dilution)) = target / 100
    // alcohol = (spirit + dilution) * (target / 100)
    // alcohol = spirit * (target / 100) + dilution * (target / 100)
    // alcohol - spirit * (target / 100) = dilution * (target / 100)
    // dilution = (alcohol - spirit * (target / 100)) / (target / 100)

    const targetDecimal = targetAbv / 100
    const requiredDilution =
      (alcoholLiters - spiritVolumeLiters * targetDecimal) / targetDecimal
    const finalVolume = spiritVolumeLiters + requiredDilution

    setDilutionAmount(requiredDilution)
    setResultAbv(targetAbv)
    setResultVolume(finalVolume)
    setResultAlcohol(alcoholLiters)
  }

  // Calculate proof mixing
  const calculateProofMix = () => {
    const abv1 = proof1 / 2 // Proof = 2x ABV
    const abv2 = proof2 / 2

    const alcohol1 = volume1 * (abv1 / 100)
    const alcohol2 = volume2 * (abv2 / 100)
    const totalAlcohol = alcohol1 + alcohol2
    const totalVolume = volume1 + volume2

    const resultProof = (totalAlcohol / totalVolume) * 200 // Convert ABV back to proof
    const resultAbvPercent = (totalAlcohol / totalVolume) * 100

    setResultAbv(resultAbvPercent)
    setResultVolume(totalVolume)
    setResultAlcohol(totalAlcohol)
  }

  // Auto-calculate on ingredient changes
  useState(() => {
    if (mode === 'mixer') calculateMixer()
  })

  const addIngredient = () => {
    const newId = Date.now().toString()
    setIngredients([
      ...ingredients,
      { id: newId, name: '', volume: 0.5, abv: 0, unit: 'oz' },
    ])
  }

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id))
  }

  const updateIngredient = (id: string, field: string, value: any) => {
    setIngredients(
      ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    )
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display text-ink-900 mb-2 flex items-center gap-3">
              <Beaker className="w-10 h-10 text-agave-600" />
              ABV Calculator
            </h1>
            <p className="text-slate-600">
              Calculate alcohol by volume for cocktails, batches, and spirit blends
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setMode('mixer')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'mixer'
                  ? 'bg-agave-600 text-white shadow-lg'
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-agave-400'
              }`}
            >
              Mixer (Cocktails)
            </button>
            <button
              onClick={() => setMode('dilute')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'dilute'
                  ? 'bg-agave-600 text-white shadow-lg'
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-agave-400'
              }`}
            >
              Dilute to Target
            </button>
            <button
              onClick={() => setMode('proof')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'proof'
                  ? 'bg-agave-600 text-white shadow-lg'
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-agave-400'
              }`}
            >
              Proof Mixing
            </button>
          </div>

          {/* MIXER MODE */}
          {mode === 'mixer' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ingredients Input */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 mb-6">
                  <h2 className="text-lg font-semibold text-ink-900 mb-6">Ingredients</h2>

                  <div className="space-y-4 mb-6">
                    {ingredients.map((ing) => (
                      <div key={ing.id} className="flex gap-3 items-end p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={ing.name}
                            onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                            placeholder="Bourbon, lemon juice, etc."
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent text-sm"
                          />
                        </div>

                        <div className="w-24">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Volume
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={ing.volume}
                            onChange={(e) =>
                              updateIngredient(ing.id, 'volume', parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent text-sm"
                          />
                        </div>

                        <div className="w-16">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Unit
                          </label>
                          <select
                            value={ing.unit}
                            onChange={(e) =>
                              updateIngredient(ing.id, 'unit', e.target.value)
                            }
                            className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent text-sm"
                          >
                            <option>oz</option>
                            <option>ml</option>
                            <option>L</option>
                          </select>
                        </div>

                        <div className="w-20">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            ABV %
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="100"
                            value={ing.abv}
                            onChange={(e) =>
                              updateIngredient(ing.id, 'abv', parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent text-sm"
                          />
                        </div>

                        <button
                          onClick={() => removeIngredient(ing.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addIngredient}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-agave-300 rounded-lg text-agave-600 hover:bg-agave-50 transition-colors font-semibold"
                  >
                    <Plus size={20} />
                    Add Ingredient
                  </button>
                </div>

                {/* Quick Reference */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-2">COMMON ABVs:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-blue-900">
                    <div>Vodka: <span className="font-bold">40%</span></div>
                    <div>Rum: <span className="font-bold">40%</span></div>
                    <div>Whiskey: <span className="font-bold">40-50%</span></div>
                    <div>Tequila: <span className="font-bold">40%</span></div>
                    <div>Gin: <span className="font-bold">40-45%</span></div>
                    <div>Cognac: <span className="font-bold">40%</span></div>
                    <div>Vermouth: <span className="font-bold">15-18%</span></div>
                    <div>Wine: <span className="font-bold">12-15%</span></div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <div className="bg-agave-50 rounded-lg p-6 border-2 border-agave-200 sticky top-6">
                  <h3 className="text-sm font-semibold text-agave-900 mb-6 uppercase tracking-wide flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Final ABV
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-agave-700 mb-2">Alcohol by Volume</p>
                      <p className="text-5xl font-bold text-agave-900">
                        {resultAbv.toFixed(1)}
                        <span className="text-2xl ml-1">%</span>
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-agave-200">
                      <p className="text-xs text-agave-700 mb-1">Total Volume</p>
                      <p className="text-2xl font-bold text-agave-900">
                        {(resultVolume * 33.814).toFixed(2)}
                        <span className="text-sm ml-1">oz</span>
                      </p>
                      <p className="text-xs text-agave-600 mt-1">
                        ({resultVolume.toFixed(3)} L)
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1">Pure Alcohol</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {(resultAlcohol * 33.814).toFixed(2)}
                        <span className="text-sm ml-1">oz</span>
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        ({resultAlcohol.toFixed(3)} L)
                      </p>
                    </div>

                    <div className="bg-slate-100 rounded-lg p-4 border border-slate-300">
                      <p className="text-xs text-slate-700 mb-2 font-semibold">STRENGTH LEVEL:</p>
                      <div className="flex gap-2">
                        <div
                          className={`h-2 flex-1 rounded ${
                            resultAbv < 10 ? 'bg-blue-400' : 'bg-slate-300'
                          }`}
                        />
                        <div
                          className={`h-2 flex-1 rounded ${
                            resultAbv >= 10 && resultAbv < 20 ? 'bg-yellow-400' : 'bg-slate-300'
                          }`}
                        />
                        <div
                          className={`h-2 flex-1 rounded ${
                            resultAbv >= 20 && resultAbv < 30 ? 'bg-orange-400' : 'bg-slate-300'
                          }`}
                        />
                        <div
                          className={`h-2 flex-1 rounded ${
                            resultAbv >= 30 ? 'bg-red-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-2">
                        {resultAbv < 10
                          ? 'Light (wine/aperitif)'
                          : resultAbv < 20
                          ? 'Medium (fortified wine)'
                          : resultAbv < 30
                          ? 'Strong (spirit forward)'
                          : 'Intense (high alcohol)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DILUTION MODE */}
          {mode === 'dilute' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Inputs */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                  <h2 className="text-lg font-semibold text-ink-900 mb-6">
                    Dilute Spirit to Target ABV
                  </h2>

                  <div className="space-y-6">
                    {/* Spirit Input */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm font-semibold text-slate-900 mb-4">Starting Spirit</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Volume
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={dilutionSpirit.volume}
                            onChange={(e) =>
                              setDilutionSpirit({
                                ...dilutionSpirit,
                                volume: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Unit
                          </label>
                          <select
                            value={dilutionSpirit.unit}
                            onChange={(e) =>
                              setDilutionSpirit({
                                ...dilutionSpirit,
                                unit: e.target.value as 'oz' | 'ml' | 'L',
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
                          >
                            <option>oz</option>
                            <option>ml</option>
                            <option>L</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            ABV %
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="100"
                            value={dilutionSpirit.abv}
                            onChange={(e) =>
                              setDilutionSpirit({
                                ...dilutionSpirit,
                                abv: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Target ABV */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Target ABV: {targetAbv.toFixed(1)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={dilutionSpirit.abv}
                        step="0.5"
                        value={targetAbv}
                        onChange={(e) => setTargetAbv(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-agave-600"
                      />
                      <div className="flex gap-2 mt-4">
                        {[5, 10, 15, 20, 25, 30, 35].map((abv) => (
                          abv <= dilutionSpirit.abv && (
                            <button
                              key={abv}
                              onClick={() => setTargetAbv(abv)}
                              className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                                Math.abs(targetAbv - abv) < 0.1
                                  ? 'bg-agave-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {abv}%
                            </button>
                          )
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={calculateDilution}
                      className="w-full bg-agave-600 text-white py-3 rounded-lg font-semibold hover:bg-agave-700 transition-colors"
                    >
                      Calculate Dilution
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <div className="bg-agave-50 rounded-lg p-6 border-2 border-agave-200 sticky top-6">
                  <h3 className="text-sm font-semibold text-agave-900 mb-6 uppercase tracking-wide">
                    Add This Much Water/Mixer
                  </h3>

                  <div className="space-y-5">
                    <div className="bg-white rounded-lg p-4 border-2 border-agave-400">
                      <p className="text-xs text-agave-700 mb-2">Amount to Add</p>
                      <p className="text-4xl font-bold text-agave-900">
                        {(dilutionAmount * 33.814).toFixed(2)}
                        <span className="text-lg ml-1">oz</span>
                      </p>
                      <p className="text-xs text-agave-600 mt-2">
                        ({dilutionAmount.toFixed(3)} L)
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1">Final Volume</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {(resultVolume * 33.814).toFixed(2)} oz
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs text-green-700 mb-1">Final ABV</p>
                      <p className="text-2xl font-bold text-green-900">
                        {targetAbv.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROOF MIXING MODE */}
          {mode === 'proof' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Inputs */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                  <h2 className="text-lg font-semibold text-ink-900 mb-6">Mix Spirits by Proof</h2>

                  <div className="space-y-6">
                    {/* Spirit 1 */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm font-semibold text-slate-900 mb-4">First Spirit</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Proof
                          </label>
                          <input
                            type="number"
                            step="1"
                            min="0"
                            max="200"
                            value={proof1}
                            onChange={(e) => setProof1(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            ({(proof1 / 2).toFixed(1)}% ABV)
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Volume (oz)
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={volume1}
                            onChange={(e) => setVolume1(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Spirit 2 */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm font-semibold text-slate-900 mb-4">Second Spirit</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Proof
                          </label>
                          <input
                            type="number"
                            step="1"
                            min="0"
                            max="200"
                            value={proof2}
                            onChange={(e) => setProof2(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            ({(proof2 / 2).toFixed(1)}% ABV)
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Volume (oz)
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={volume2}
                            onChange={(e) => setVolume2(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={calculateProofMix}
                      className="w-full bg-agave-600 text-white py-3 rounded-lg font-semibold hover:bg-agave-700 transition-colors"
                    >
                      Calculate Mix
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <div className="bg-agave-50 rounded-lg p-6 border-2 border-agave-200 sticky top-6">
                  <h3 className="text-sm font-semibold text-agave-900 mb-6 uppercase tracking-wide">
                    Final Result
                  </h3>

                  <div className="space-y-5">
                    <div className="bg-white rounded-lg p-4 border-2 border-agave-400">
                      <p className="text-xs text-agave-700 mb-2">Proof</p>
                      <p className="text-4xl font-bold text-agave-900">
                        {((resultAbv / 100) * 200).toFixed(1)}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1">ABV</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {resultAbv.toFixed(1)}%
                      </p>
                    </div>

                    <div className="bg-slate-100 rounded-lg p-4 border border-slate-300">
                      <p className="text-xs text-slate-700 mb-2 font-semibold">TOTAL VOLUME</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {(resultVolume * 33.814).toFixed(2)} oz
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}
