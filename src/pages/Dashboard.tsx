import { useState } from 'react';
import { HelpCircle, TrendingUp, AlertTriangle, Clipboard } from 'lucide-react';
import { cropData } from '../data/cropData';
import { fieldsData } from '../data/fieldData';
import { yearOnYear } from '../data/metricsData';

interface YearOnYearMetric {
  name: string;
  value: string;
  trend: number;
}

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState('2024');

  // Calculate summary metrics
  const totalHectares = Object.values(cropData).reduce((sum, crop) => sum + parseFloat(crop.area), 0);
  const totalCost = Object.values(cropData).reduce((sum, crop) => sum + (crop.cost.value * parseFloat(crop.area)), 0);
  const averageYield = Object.values(cropData).reduce((sum, crop) => sum + crop.yield.value, 0) / cropData.length;
  const totalGrossMargin = Object.values(cropData).reduce((sum, crop) => sum + (crop.gm.value * parseFloat(crop.area)), 0);

  // Find warning indicators
  const underperformingCrops = cropData.filter(crop => crop.yield.hasWarning || crop.cop.hasWarning);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-50 px-3 py-2 rounded-md"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clipboard className="mr-2" size={20} />
            Financial Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total Farm Cost</div>
              <div className="text-xl font-bold">£{totalCost.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Gross Margin</div>
              <div className="text-xl font-bold">£{totalGrossMargin.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Average Cost/ha</div>
              <div className="text-xl font-bold">£{(totalCost / totalHectares).toLocaleString('en-GB', { maximumFractionDigits: 0 })}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Average GM/ha</div>
              <div className="text-xl font-bold">£{(totalGrossMargin / totalHectares).toLocaleString('en-GB', { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
        </div>

        {/* Operations Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Operations Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total Hectares</div>
              <div className="text-xl font-bold">{totalHectares.toLocaleString('en-GB', { maximumFractionDigits: 1 })} ha</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Average Yield</div>
              <div className="text-xl font-bold">{averageYield.toFixed(2)} t/ha</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Fields in Rotation</div>
              <div className="text-xl font-bold">{fieldsData.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Crops</div>
              <div className="text-xl font-bold">{cropData.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Performance and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Performance Indicators */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Crops</h2>
          <div className="space-y-4">
            {cropData
              .sort((a, b) => b.gm.value - a.gm.value)
              .slice(0, 3)
              .map((crop, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{crop.name}</div>
                    <div className="text-sm text-gray-600">{crop.area}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">£{crop.gm.value.toFixed(2)}/ha</div>
                    <div className="text-sm text-gray-600">{crop.yield.value.toFixed(1)} t/ha</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Alerts and Warnings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            Alerts & Warnings
          </h2>
          <div className="space-y-4">
            {underperformingCrops.map((crop, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
                <div>
                  <div className="font-medium">{crop.name}</div>
                  <div className="text-sm text-gray-600">
                    {crop.yield.hasWarning ? 'Below target yield' : 'High cost of production'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">£{crop.cop.value.toFixed(2)}/t</div>
                  <div className="text-sm text-gray-600">{crop.yield.value.toFixed(1)} t/ha</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Prices and Year-on-Year Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Prices */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <HelpCircle className="mr-2" size={20} />
            Market Prices
          </h2>
          <div className="space-y-4">
            {cropData.map((crop, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="font-medium">{crop.name}</div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Range: </span>
                    £{crop.marketRange.min.toFixed(2)} - £{crop.marketRange.max.toFixed(2)}
                  </div>
                  <div className="font-medium">
                    Current: £{crop.marketRange.current.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Year on Year Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Year-on-Year Analysis</h2>
          <div className="space-y-4">
            {yearOnYear.map((metric: YearOnYearMetric, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div className="font-medium">{metric.name}</div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${metric.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend >= 0 ? '+' : ''}{metric.trend}%
                  </span>
                  <span className="font-medium">{metric.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}