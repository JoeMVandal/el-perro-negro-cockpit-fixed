'use client'

import { useState, useEffect } from 'react'
import { ProtectedLayout } from '@/components/ProtectedLayout'
import { ArrowRight, Settings } from 'lucide-react'

interface CarbonationResult {
  currentCO2: number
  targetCO2: number
  difference: number
  volumeInLiters: number
  volumeInGallons: number
  co2NeededGrams: number
  co2NeededVolumes: number
  pressureNeeded: number
}

export default function CarbonationCalcPage() {
  const [volumeValue, setVolumeValue] = useState(1)
  const [volumeUnit, setVolumeUnit] = useState<'liters' | 'gallons'>('liters')
  const [currentCO2, setCurrentCO2] = useState(0)
  const [targetCO2, setTargetCO2] = useState(2.5)
  const [temperature, setTemperature] = useState(38) // Fahrenheit
  const [result, setResult] = useState<CarbonationResult | null>(null)

  const CO2_DENSITY_AT_STP = 1.98 // grams per liter at 0°C, 1 atm

  // Temperature correction factor (simplified)
  const getTemperatureCorrection = (tempF: number) => {
    const tempC = (tempF - 32) * (5 / 9)
    // CO2 solubility increases ~3.5% per °C decrease
    return 1 + (tempC - 0) * 0.035
  }

  const calculateCarbonation = () => {
    const liters = volumeUnit === 'liters' ? volumeValue : volumeValue * 3.78541
    const gallons = volumeUnit === 'gallons' ? volumeValue : volumeValue / 3.78541
    const difference = targetCO2 - currentCO2

    if (difference <= 0) {
      setResult(null)
      return
    }

    // CO2 needed in grams: volumes × liters × density × temperature correction
    const tempCorrection = getTemperatureCorrection(temperature)
    const co2Grams = difference * liters * CO2_DENSITY_AT_STP * tempCorrection

    // CO2 volumes is the direct difference
    const co2Volumes = difference * liters

    // Pressure needed (simplified: ~14.5 psi per volume of CO2)
    const pressurePsi = difference * 14.5

    setResult({
      currentCO2,
      targetCO2,
      difference,
      volumeInLiters: liters,
      volumeInGallons: gallons,
      co2NeededGrams: co2Grams,
      co2NeededVolumes: co2Volumes,
      pressureNeeded: pressurePsi,
    })
  }

  useEffect(() => {
    calculateCarbonation()
  }, [volumeValue, volumeUnit, currentCO2, targetCO2, temperature])

  const presetTargets = [
    { label: 'Still (flat)', value: 0 },
    { label: 'Lightly carbonated', value: 1.5 },
    { label: 'Standard (beer)', value: 2.5 },
    { label: 'Champagne', value: 3.7 },
    { label: 'Highly carbonated', value: 4.5 },
  ]

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display text-ink-900 mb-2">
              Carbonation Calculator
            </h1>
            <p className="text-slate-600">
              Calculate CO₂ needed to reach your target carbonation levels
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                <h2 className="text-lg font-semibold text-ink-900 mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-agave-600" />
                  Parameters
                </h2>

                {/* Liquid Volume */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Liquid Volume
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={volumeValue}
                      onChange={(e) => setVolumeValue(parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent"
                    />
                    <select
                      value={volumeUnit}
                      onChange={(e) => setVolumeUnit(e.target.value as 'liters' | 'gallons')}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agave-500 focus:border-transparent bg-white"
                    >
                      <option value="liters">Liters</option>
                      <option value="gallons">Gallons</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-500">
                    {volumeUnit === 'liters'
                      ? `${(volumeValue / 3.78541).toFixed(2)} gallons`
                      : `${(volumeValue * 3.78541).toFixed(2)} liters`}
                  </p>
                </div>

                {/* Temperature */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Temperature: {temperature}°F ({((temperature - 32) * (5 / 9)).toFixed(1)}°C)
                  </label>
                  <input
                    type="range"
                    min="32"
                    max="68"
                    value={temperature}
                    onChange={(e) => setTemperature(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-agave-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>32°F</span>
                    <span>68°F</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Colder liquid holds more carbonation
                  </p>
                </div>

                {/* Current CO2 */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Current CO₂ Volumes: {currentCO2.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={currentCO2}
                    onChange={(e) => setCurrentCO2(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-agave-600"
                  />
                  <div className="flex gap-2 mt-3">
                    {[0, 1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onClick={() => setCurrentCO2(v)}
                        className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                          currentCO2 === v
                            ? 'bg-agave-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target CO2 */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Target CO₂ Volumes: {targetCO2.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={targetCO2}
                    onChange={(e) => setTargetCO2(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-agave-600"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {presetTargets.map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => setTargetCO2(value)}
                        className={`px-2 py-2 text-xs rounded font-medium transition-colors whitespace-nowrap ${
                          targetCO2 === value
                            ? 'bg-agave-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            {result && (
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Summary */}
                  <div className="bg-agave-50 rounded-lg p-6 border-2 border-agave-200">
                    <h3 className="text-sm font-semibold text-agave-900 mb-4 uppercase tracking-wide">
                      CO₂ Needed
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-agave-700 mb-1">Grams</p>
                        <p className="text-3xl font-bold text-agave-900">
                          {result.co2NeededGrams.toFixed(1)}
                          <span className="text-lg ml-1">g</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-agave-700 mb-1">Liters of CO₂ Gas (at STP)</p>
                        <p className="text-3xl font-bold text-agave-900">
                          {result.co2NeededVolumes.toFixed(2)}
                          <span className="text-lg ml-1">L</span>
                        </p>
                      </div>
                      <div className="pt-2 border-t-2 border-agave-200">
                        <p className="text-xs text-agave-700 mb-1">Pressure Needed</p>
                        <p className="text-2xl font-bold text-agave-900">
                          {result.pressureNeeded.toFixed(1)}
                          <span className="text-sm ml-1">psi</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-ink-900 mb-4 uppercase tracking-wide">
                      Calculation Breakdown
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Liquid Volume</span>
                        <span className="font-medium text-slate-900">
                          {result.volumeInLiters.toFixed(2)} L ({result.volumeInGallons.toFixed(2)} gal)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Current Carbonation</span>
                        <span className="font-medium text-slate-900">{result.currentCO2.toFixed(2)} vol</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Target Carbonation</span>
                        <span className="font-medium text-slate-900">{result.targetCO2.toFixed(2)} vol</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 flex justify-between">
                        <span className="text-slate-600">Difference</span>
                        <span className="font-bold text-agave-600">{result.difference.toFixed(2)} vol</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded border border-blue-200 mt-3">
                        <p className="text-xs text-blue-900">
                          <strong>Temperature adjusted:</strong> {temperature}°F increases CO₂ solubility
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Methods */}
                <div className="mt-6 bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-ink-900 mb-4 uppercase tracking-wide">
                    Methods to Achieve This
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="border-l-2 border-agave-400 pl-3">
                      <p className="font-semibold text-slate-900 mb-1">CO₂ Cylinder</p>
                      <p className="text-slate-600 text-xs">
                        Use a regulator set to ~{result.pressureNeeded.toFixed(0)} psi. Inject gas through carbonation stone or headspace.
                      </p>
                    </div>
                    <div className="border-l-2 border-agave-400 pl-3">
                      <p className="font-semibold text-slate-900 mb-1">Dry Ice (Approx)</p>
                      <p className="text-slate-600 text-xs">
                        {(result.co2NeededGrams / 1000).toFixed(2)} kg of dry ice. Handle with insulated gloves, use in well-ventilated space.
                      </p>
                    </div>
                    <div className="border-l-2 border-blue-400 pl-3">
                      <p className="font-semibold text-slate-900 mb-1">SodaStream/Counter Pressure</p>
                      <p className="text-slate-600 text-xs">
                        Multiple short bursts. Allow time to settle between bursts for proper carbonation.
                      </p>
                    </div>
                    <div className="border-l-2 border-blue-400 pl-3">
                      <p className="font-semibold text-slate-900 mb-1">Whipped Cream Charger</p>
                      <p className="text-slate-600 text-xs">
                        Each N₂O bulb = ~8g CO₂ equivalent. Use {(result.co2NeededGrams / 8).toFixed(0)} chargers (approximate).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!result && (
              <div className="lg:col-span-2 bg-slate-50 rounded-lg p-8 border border-dashed border-slate-300 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <p className="text-slate-500 mb-2">Adjust parameters to see CO₂ requirements</p>
                  <p className="text-sm text-slate-400">
                    Target carbonation must be higher than current level
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Reference Info */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Reference: CO₂ Volumes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-900">
              <div>
                <p className="font-medium">Still Water</p>
                <p className="text-blue-700">0 vol</p>
              </div>
              <div>
                <p className="font-medium">Lightly Fizzy</p>
                <p className="text-blue-700">1.0-1.5 vol</p>
              </div>
              <div>
                <p className="font-medium">Beer</p>
                <p className="text-blue-700">2.2-2.7 vol</p>
              </div>
              <div>
                <p className="font-medium">Champagne</p>
                <p className="text-blue-700">5-6 vol</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
