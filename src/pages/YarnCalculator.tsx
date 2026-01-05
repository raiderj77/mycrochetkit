/**
 * Yarn Calculator Page
 * 
 * Calculate yarn requirements and project costs
 */

import { useState } from 'react';
import { Calculator, DollarSign, Package, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Link } from 'react-router-dom';
import {
  calculateRectangularYardage,
  calculateCircularYardage,
  calculateProjectCost,
  checkYarnSufficiency,
  getYarnWeightRecommendations,
  estimateProjectTime,
} from '@/utils/yarnCalculator';

type ProjectShape = 'rectangular' | 'circular';

export default function YarnCalculator() {
  const { user } = useAuthStore();
  const [shape, setShape] = useState<ProjectShape>('rectangular');
  const [projectType, setProjectType] = useState('blanket');
  
  // Rectangular dimensions
  const [width, setWidth] = useState(40);
  const [length, setLength] = useState(50);
  
// Circular dimensions
  const [diameter, setDiameter] = useState(20);
  const [height, setHeight] = useState(8);
  
  // Yarn details
  const [gauge, setGauge] = useState(4);
  const [yardsPerSkein, setYardsPerSkein] = useState(364);
  const [pricePerSkein, setPricePerSkein] = useState(5);
  const [additionalCosts, setAdditionalCosts] = useState(0);
  
  // Stash check
  const [yardageInStash, setYardageInStash] = useState(0);
  
  // Calculate results
  const calculation = shape === 'rectangular'
    ? calculateRectangularYardage({ width, length, gauge }, yardsPerSkein)
    : calculateCircularYardage(diameter, height, gauge, yardsPerSkein);
  
  const totalCost = calculateProjectCost(
    calculation.totalYardage,
    yardsPerSkein,
    pricePerSkein,
    additionalCosts
  );
  
  const stashCheck = checkYarnSufficiency(calculation.totalYardage, yardageInStash);
  const recommendations = getYarnWeightRecommendations(projectType);
  const timeEstimate = estimateProjectTime(
    (shape === 'rectangular' ? width * length : Math.PI * (diameter / 2) ** 2 * height) * gauge * gauge
  );
  
  return (
    <div className="container mx-auto p-6 calculator-container">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Yarn Calculator
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Calculate yarn requirements and estimated costs for your project
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Project Type */}
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Project Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Project Type</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="input"
                >
                  <option value="blanket">Blanket</option>
                  <option value="scarf">Scarf</option>
                  <option value="hat">Hat</option>
                  <option value="amigurumi">Amigurumi</option>
                  <option value="shawl">Shawl</option>
                  <option value="garment">Garment</option>
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">Shape</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShape('rectangular')}
                    className={`btn-toggle flex-1 rounded-lg border-2 p-3 transition-colors ${
                      shape === 'rectangular'
                        ? 'active border-primary-600 bg-primary-100 text-primary-950 active-toggle dark:border-primary-400 dark:bg-white dark:text-black font-bold'
                        : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    Rectangular
                  </button>
                  <button
                    onClick={() => setShape('circular')}
                    className={`btn-toggle flex-1 rounded-lg border-2 p-3 transition-colors ${
                      shape === 'circular'
                        ? 'active border-primary-600 bg-primary-100 text-primary-950 active-toggle dark:border-primary-400 dark:bg-white dark:text-black font-bold'
                        : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    Circular
                  </button>
                </div>
              </div>
              
              {shape === 'rectangular' ? (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Width (inches)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="input"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Length (inches)</label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="input"
                      min="1"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Diameter (inches)</label>
                    <input
                      type="number"
                      value={diameter}
                      onChange={(e) => setDiameter(Number(e.target.value))}
                      className="input"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Height (inches)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="input"
                      min="1"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Gauge (stitches per inch)
                </label>
                <input
                  type="number"
                  value={gauge}
                  onChange={(e) => setGauge(Number(e.target.value))}
                  className="input"
                  min="1"
                  step="0.5"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Recommended: {recommendations.gauge} stitches/inch
                </p>
              </div>
            </div>
          </div>
          
          {/* Yarn Details */}
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Yarn Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Yards per Skein</label>
                <input
                  type="number"
                  value={yardsPerSkein}
                  onChange={(e) => setYardsPerSkein(Number(e.target.value))}
                  className="input"
                  min="1"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">Price per Skein ($)</label>
                <input
                  type="number"
                  value={pricePerSkein}
                  onChange={(e) => setPricePerSkein(Number(e.target.value))}
                  className="input"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Additional Supplies ($)
                </label>
                <input
                  type="number"
                  value={additionalCosts}
                  onChange={(e) => setAdditionalCosts(Number(e.target.value))}
                  className="input"
                  min="0"
                  step="0.01"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Hooks, buttons, stuffing, etc.
                </p>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Yarn in Stash (yards)
                </label>
                <input
                  type="number"
                  value={yardageInStash}
                  onChange={(e) => setYardageInStash(Number(e.target.value))}
                  className="input"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="space-y-6">
          {/* Main Results */}
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
            <h2 className="mb-4 text-xl font-semibold">Results</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-white/50 p-4 dark:bg-black/20">
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-primary-600" />
                  <span className="font-medium">Total Yardage</span>
                </div>
                <span className="text-2xl font-bold text-primary-600">
                  {calculation.totalYardage.toLocaleString()} yds
                </span>
              </div>
              
              <div className="flex items-center justify-between rounded-lg bg-white/50 p-4 dark:bg-black/20">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-blue-600" />
                  <span className="font-medium">Skeins Needed</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {calculation.totalSkeins}
                </span>
              </div>
              
              <div className="flex items-center justify-between rounded-lg bg-white/50 p-4 dark:bg-black/20">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <span className="font-medium">Estimated Cost</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              
              <div className="flex items-center justify-between rounded-lg bg-white/50 p-4 dark:bg-black/20">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <span className="font-medium">Estimated Time</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{timeEstimate.hours}h</p>
                  <p className="text-xs text-neutral-600">~{timeEstimate.weeks} weeks</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stash Check */}
          {yardageInStash > 0 && (
            <div
              className={`card ${
                stashCheck.hasEnough
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  className={`h-6 w-6 ${
                    stashCheck.hasEnough ? 'text-green-600' : 'text-red-600'
                  }`}
                />
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold">Stash Check</h3>
                  {stashCheck.hasEnough ? (
                    <>
                      <p className="text-green-800 dark:text-green-200">
                        ✓ You have enough yarn!
                      </p>
                      <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                        {stashCheck.excess} yards extra
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-red-800 dark:text-red-200">
                        ✗ You need more yarn
                      </p>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {stashCheck.shortage} yards short (
                        {Math.ceil(stashCheck.shortage! / yardsPerSkein)} more skeins)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Recommendations */}
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Recommendations</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Yarn Weight
                </p>
                <p className="text-lg font-semibold capitalize">
                  {recommendations.recommended.join(', ')}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Hook Size
                </p>
                <p className="text-lg font-semibold">{recommendations.hookSize}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Recommended Gauge
                </p>
                <p className="text-lg font-semibold">{recommendations.gauge} sts/inch</p>
              </div>
            </div>
          </div>
          
          {/* Pro Tip */}
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Pro Tip:</strong> Always buy 10-20% extra yarn to account for gauge variations and mistakes. It's better to have too much than run out mid-project!
            </p>
          </div>

          {!user && (
            <div className="card bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white p-8 text-center shadow-xl">
              <h3 className="text-2xl font-black mb-2">Want to save your projects?</h3>
              <p className="opacity-90 mb-6 max-w-md mx-auto">Sign up for a free account to save your yardage calculations and keep your stash updated across devices.</p>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-neutral-50 transition-colors"
              >
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
