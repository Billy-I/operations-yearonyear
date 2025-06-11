import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DashboardCropData } from '../../data/dashboardMockData';

interface CropMonitoringWidgetProps {
  crops: DashboardCropData[];
  onViewTrackerClick?: () => void;
}

interface CostTimeSeriesData {
  month: string;
  inputs: number;
  operations: number;
  total: number;
}

interface SalesData {
  month: string;
  sales: number;
  price: number;
}

const CropMonitoringWidget: React.FC<CropMonitoringWidgetProps> = ({
  crops,
  onViewTrackerClick
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'costs' | 'sales'>('overview');

  // Mock time series data for costs
  const mockCostData: CostTimeSeriesData[] = [
    { month: 'Jan', inputs: 8500, operations: 4200, total: 12700 },
    { month: 'Feb', inputs: 12200, operations: 5800, total: 18000 },
    { month: 'Mar', inputs: 15800, operations: 7200, total: 23000 },
    { month: 'Apr', inputs: 18200, operations: 8900, total: 27100 },
    { month: 'May', inputs: 22100, operations: 10500, total: 32600 },
    { month: 'Jun', inputs: 25800, operations: 12200, total: 38000 },
    { month: 'Jul', inputs: 28200, operations: 13800, total: 42000 },
    { month: 'Aug', inputs: 30500, operations: 15200, total: 45700 },
  ];

  // Mock sales data
  const mockSalesData: SalesData[] = [
    { month: 'Aug', sales: 12500, price: 185 },
    { month: 'Sep', sales: 28200, price: 192 },
    { month: 'Oct', sales: 35800, price: 178 },
    { month: 'Nov', sales: 42100, price: 203 },
    { month: 'Dec', sales: 48500, price: 198 },
    { month: 'Jan', sales: 52200, price: 215 },
    { month: 'Feb', sales: 56800, price: 208 },
    { month: 'Mar', sales: 61200, price: 221 },
  ];

  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
  const totalRevenue = crops.reduce((sum, crop) => sum + crop.revenue, 0);
  const totalCosts = crops.reduce((sum, crop) => sum + crop.cost, 0);
  const totalProfit = totalRevenue - totalCosts;

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Area</div>
          <div className="text-2xl font-bold text-gray-900">{totalArea} ha</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-green-600">£{(totalRevenue / 1000).toFixed(0)}k</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Costs</div>
          <div className="text-2xl font-bold text-red-600">£{(totalCosts / 1000).toFixed(0)}k</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Net Profit</div>
          <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            £{(totalProfit / 1000).toFixed(0)}k
          </div>
        </div>
      </div>

      {/* Crops Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Available Crops</h4>
          {onViewTrackerClick && (
            <button
              onClick={onViewTrackerClick}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Full Tracker →
            </button>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-3 text-sm font-medium text-gray-600 border-b border-gray-200">
            <div>Crop</div>
            <div className="text-right">Area (ha)</div>
            <div className="text-right">Yield (t/ha)</div>
            <div className="text-right">Revenue</div>
            <div className="text-right">Costs</div>
            <div className="text-right">Profit</div>
          </div>
          {crops.slice(0, 5).map((crop) => (
            <div key={crop.id} className="grid grid-cols-6 gap-4 p-3 text-sm border-b border-gray-100 last:border-0">
              <div className="font-medium text-gray-900">{crop.name}</div>
              <div className="text-right text-gray-700">{crop.area}</div>
              <div className="text-right text-gray-700">{crop.yield}</div>
              <div className="text-right text-green-600 font-medium">£{(crop.revenue / 1000).toFixed(0)}k</div>
              <div className="text-right text-red-600 font-medium">£{(crop.cost / 1000).toFixed(0)}k</div>
              <div className={`text-right font-medium ${(crop.revenue - crop.cost) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                £{((crop.revenue - crop.cost) / 1000).toFixed(0)}k
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCostsTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Progression</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: any) => [`£${(value / 1000).toFixed(1)}k`, '']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="inputs" 
                stroke="#f59e0b" 
                strokeWidth={3}
                name="Input Costs"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="operations" 
                stroke="#06b6d4" 
                strokeWidth={3}
                name="Operations"
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#dc2626" 
                strokeWidth={3}
                name="Total Costs"
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="text-sm text-amber-700 mb-1">Input Costs (YTD)</div>
          <div className="text-2xl font-bold text-amber-800">£30.5k</div>
          <div className="text-xs text-amber-600 mt-1">Seeds, Fertilizer, Chemicals</div>
        </div>
        <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
          <div className="text-sm text-cyan-700 mb-1">Operations (YTD)</div>
          <div className="text-2xl font-bold text-cyan-800">£15.2k</div>
          <div className="text-xs text-cyan-600 mt-1">Labor, Machinery, Fuel</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-sm text-red-700 mb-1">Total Costs (YTD)</div>
          <div className="text-2xl font-bold text-red-800">£45.7k</div>
          <div className="text-xs text-red-600 mt-1">All farming costs</div>
        </div>
      </div>
    </div>
  );

  const renderSalesTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Incoming Sales</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'sales' ? `£${(value / 1000).toFixed(1)}k` : `£${value}/t`,
                  name === 'sales' ? 'Sales Revenue' : 'Price per Tonne'
                ]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="sales" fill="#10b981" name="sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-700 mb-1">Total Sales (YTD)</div>
          <div className="text-2xl font-bold text-green-800">£61.2k</div>
          <div className="text-xs text-green-600 mt-1">Revenue from sales</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-700 mb-1">Avg Price/Tonne</div>
          <div className="text-2xl font-bold text-blue-800">£203</div>
          <div className="text-xs text-blue-600 mt-1">Weighted average</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-700 mb-1">Tonnes Sold</div>
          <div className="text-2xl font-bold text-purple-800">301t</div>
          <div className="text-xs text-purple-600 mt-1">Total volume</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Crop Monitoring</h3>
            <p className="text-sm text-gray-600 mt-1">Overview of crop performance, costs, and sales</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'costs', label: 'Costs Tracking' },
            { key: 'sales', label: 'Sales Data' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'costs' && renderCostsTab()}
          {activeTab === 'sales' && renderSalesTab()}
        </div>
      </div>
    </div>
  );
};

export default CropMonitoringWidget;