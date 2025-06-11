import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardCropData } from '../../data/dashboardMockData';

interface CropBreakEvenAnalysisWidgetProps {
  crops: DashboardCropData[];
}

interface BreakEvenData {
  cropName: string;
  revenue: number;
  cost: number;
  breakEvenPoint: number;
  profitMargin: number;
  progressToBreakEven: number;
}

const CropBreakEvenAnalysisWidget: React.FC<CropBreakEvenAnalysisWidgetProps> = ({ crops }) => {
  const [viewType, setViewType] = useState<'breakeven' | 'margin'>('breakeven');
  const [selectedCrop, setSelectedCrop] = useState(crops[0]?.id || '');

  // Transform crop data into break-even analysis data
  const breakEvenData: BreakEvenData[] = crops.map(crop => {
    const breakEvenPoint = crop.cost * 0.85; // Assuming break-even is at 85% of total costs
    const profitMargin = ((crop.revenue - crop.cost) / crop.revenue) * 100;
    let progressToBreakEven = (crop.revenue / breakEvenPoint) * 100;
    
    return {
      cropName: crop.name,
      revenue: crop.revenue,
      cost: crop.cost,
      breakEvenPoint,
      profitMargin,
      progressToBreakEven
    };
  });

  const currentCrop = breakEvenData.find(crop => crops.find(c => c.name === crop.cropName)?.id === selectedCrop) || breakEvenData[0];

  // Colors for different crops
  const cropColors = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4'];

  const renderBreakEvenView = () => {
    if (!currentCrop) return null;

    // Generate monthly progress data for the selected crop
    const monthlyProgressData = [
      { month: 'Jan', actual: currentCrop.breakEvenPoint * 0.05, breakEven: currentCrop.breakEvenPoint },
      { month: 'Feb', actual: currentCrop.breakEvenPoint * 0.12, breakEven: currentCrop.breakEvenPoint },
      { month: 'Mar', actual: currentCrop.breakEvenPoint * 0.22, breakEven: currentCrop.breakEvenPoint },
      { month: 'Apr', actual: currentCrop.breakEvenPoint * 0.35, breakEven: currentCrop.breakEvenPoint },
      { month: 'May', actual: currentCrop.breakEvenPoint * 0.48, breakEven: currentCrop.breakEvenPoint },
      { month: 'Jun', actual: currentCrop.breakEvenPoint * 0.62, breakEven: currentCrop.breakEvenPoint },
      { month: 'Jul', actual: currentCrop.breakEvenPoint * 0.78, breakEven: currentCrop.breakEvenPoint },
      { month: 'Aug', actual: currentCrop.breakEvenPoint * 0.95, breakEven: currentCrop.breakEvenPoint },
      { month: 'Sep', actual: currentCrop.revenue * 0.85, breakEven: currentCrop.breakEvenPoint },
      { month: 'Oct', actual: currentCrop.revenue * 0.95, breakEven: currentCrop.breakEvenPoint },
      { month: 'Nov', actual: currentCrop.revenue, breakEven: currentCrop.breakEvenPoint },
      { month: 'Dec', actual: currentCrop.revenue, breakEven: currentCrop.breakEvenPoint }
    ];

    return (
      <div className="space-y-6">
        {/* Crop Selector */}
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Break-Even Progress</h4>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {crops.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
        </div>

        {/* Line Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `£${(value / 1000).toFixed(1)}k`,
                  name === 'actual' ? 'Current Performance' : 'Break-Even Target'
                ]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="breakEven"
                stroke="#f59e0b"
                strokeWidth={3}
                strokeDasharray="8 8"
                name="breakEven"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                strokeWidth={3}
                name="actual"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={`rounded-lg p-4 border ${
            currentCrop.revenue >= currentCrop.breakEvenPoint 
              ? 'bg-green-50 border-green-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className={`text-sm mb-1 ${
              currentCrop.revenue >= currentCrop.breakEvenPoint 
                ? 'text-green-700' 
                : 'text-amber-700'
            }`}>
              Status
            </div>
            <div className={`text-2xl font-bold ${
              currentCrop.revenue >= currentCrop.breakEvenPoint 
                ? 'text-green-800' 
                : 'text-amber-800'
            }`}>
              {currentCrop.revenue >= currentCrop.breakEvenPoint ? 'Above' : 'Below'} Break-Even
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Break-Even Target</div>
            <div className="text-2xl font-bold text-amber-600">
              £{(currentCrop.breakEvenPoint / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Current Performance</div>
            <div className="text-2xl font-bold text-green-600">
              £{(currentCrop.revenue / 1000).toFixed(0)}k
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMarginView = () => {
    const pieData = breakEvenData.map((crop, index) => ({
      name: crop.cropName,
      value: Math.max(crop.profitMargin, 0),
      color: cropColors[index % cropColors.length]
    }));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Profit Margin Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Profit Margin']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Margin Rankings */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Profitability Ranking</h4>
            <div className="space-y-3">
              {breakEvenData
                .sort((a, b) => b.profitMargin - a.profitMargin)
                .map((crop, index) => (
                  <div key={crop.cropName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-bold text-gray-600">#{index + 1}</div>
                      <div>
                        <div className="font-medium text-gray-900">{crop.cropName}</div>
                        <div className="text-sm text-gray-600">
                          £{((crop.revenue - crop.cost) / 1000).toFixed(0)}k profit
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${crop.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {crop.profitMargin.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">margin</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Break-Even Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Financial performance and profitability analysis</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'breakeven', label: 'Break-Even' },
            { key: 'margin', label: 'Profit Margins' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setViewType(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === tab.key
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
          {viewType === 'breakeven' && renderBreakEvenView()}
          {viewType === 'margin' && renderMarginView()}
        </div>
      </div>
    </div>
  );
};

export default CropBreakEvenAnalysisWidget;