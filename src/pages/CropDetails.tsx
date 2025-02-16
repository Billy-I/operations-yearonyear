import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type ViewType = 'Variable' | 'Operations' | 'Total';

const costData = [
  { month: 'Jul', my2024: 0, bestInClass2024: 0, bestInClass2023: 0, priorAverage: 0 },
  { month: 'Aug', my2024: 20, bestInClass2024: 10, bestInClass2023: 15, priorAverage: 15 },
  { month: 'Sep', my2024: 50, bestInClass2024: 40, bestInClass2023: 45, priorAverage: 45 },
  { month: 'Oct', my2024: 170, bestInClass2024: 90, bestInClass2023: 80, priorAverage: 160 },
  { month: 'Nov', my2024: 180, bestInClass2024: 95, bestInClass2023: 85, priorAverage: 170 },
  { month: 'Dec', my2024: 190, bestInClass2024: 100, bestInClass2023: 90, priorAverage: 180 },
  { month: 'Jan', my2024: 200, bestInClass2024: 105, bestInClass2023: 95, priorAverage: 190 },
  { month: 'Feb', my2024: 300, bestInClass2024: 110, bestInClass2023: 100, priorAverage: 280 },
  { month: 'Mar', my2024: 450, bestInClass2024: 150, bestInClass2023: 140, priorAverage: 420 },
  { month: 'Apr', my2024: 600, bestInClass2024: 250, bestInClass2023: 200, priorAverage: 580 },
  { month: 'May', my2024: 700, bestInClass2024: 350, bestInClass2023: 280, priorAverage: 680 },
  { month: 'Jun', my2024: 750, bestInClass2024: 380, bestInClass2023: 300, priorAverage: 730 },
  { month: 'Jul', my2024: 769, bestInClass2024: 390, bestInClass2023: 310, priorAverage: 740 }
];

export default function CropDetails() {
  const { crop } = useParams();
  const [selectedView, setSelectedView] = useState<ViewType>('Variable');
  const [selectedYear, setSelectedYear] = useState('2024');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/tracker/crop-progress" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-sm text-gray-600">Tracker / Crop Progress / {crop}</div>
            <h1 className="text-2xl font-bold">{crop}</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 flex items-center">
            Add budgets
            <span className="ml-1">→</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent border-none focus:ring-0"
              >
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Crop Production</h2>
            <button className="text-gray-700">Add budgets →</button>
          </div>
          
          <div className="grid grid-cols-5 gap-6 mb-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Field area</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-bold">641.16 ha</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600"># Fields</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-bold">36</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Production</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-bold">5079.79 t</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Yield</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-bold">8.3 t/ha</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">£ achieved</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-bold">£0</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Costs</h2>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="mr-1">⚠️</span>
              <span>Your most recent Product Application data is from Wed Jul 17 2024.</span>
              <button className="text-blue-600 hover:underline ml-2">Upload new data here.</button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 800]} />
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                      <Line type="monotone" dataKey="my2024" name="My 2024" stroke="#000000" strokeWidth={2} />
                      <Line type="monotone" dataKey="bestInClass2024" name="Best in class (2024)" stroke="#666666" strokeWidth={2} />
                      <Line type="monotone" dataKey="bestInClass2023" name="Best in class (2023)" stroke="#999999" strokeWidth={2} />
                      <Line type="monotone" dataKey="priorAverage" name="My prior 3 years' average" stroke="#000000" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Cost per hectare</span>
                      <HelpCircle size={16} className="text-gray-400" />
                    </div>
                    <div className="font-bold">£769.43/ha</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Total cost</span>
                      <HelpCircle size={16} className="text-gray-400" />
                    </div>
                    <div className="font-bold">£493326.36</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Cost of production</span>
                      <HelpCircle size={16} className="text-gray-400" />
                    </div>
                    <div className="font-bold">£97.12/t</div>
                  </div>
                  
                  <table className="w-full mt-6">
                    <thead>
                      <tr>
                        <th className="text-left text-sm text-gray-600">Category</th>
                        <th className="text-right text-sm text-gray-600">Cost</th>
                        <th className="text-right text-sm text-gray-600">% var</th>
                        <th className="text-right text-sm text-gray-600">% budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2">Seed</td>
                        <td className="text-right">£66,601.99<br/><span className="text-sm text-gray-500">£102.32/ha</span></td>
                        <td className="text-right text-green-600">+17%</td>
                        <td className="text-right">N/A</td>
                      </tr>
                      <tr>
                        <td className="py-2">Fertiliser</td>
                        <td className="text-right">£182,660.99<br/><span className="text-sm text-gray-500">£284.89/ha</span></td>
                        <td className="text-right text-red-600">-9%</td>
                        <td className="text-right">N/A</td>
                      </tr>
                      <tr>
                        <td className="py-2">Chemical</td>
                        <td className="text-right">£244,063.37<br/><span className="text-sm text-gray-500">£382.22/ha</span></td>
                        <td className="text-right text-green-600">+19%</td>
                        <td className="text-right">N/A</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <button className="w-full mt-6 py-2 bg-gray-900 text-white rounded-lg">
                    View cost details →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Sales</h2>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="mr-1">⚠️</span>
              <span>Your most recent contracts data is from Mon Feb 05 2024.</span>
              <button className="text-blue-600 hover:underline ml-2">Upload new data here.</button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={[
                      { month: 'November 2024', quantity: 120, quantityContract: 60, price: 220, priceContract: 215 },
                      { month: 'December', quantity: 90, quantityContract: 0, price: 225, priceContract: 220 },
                      { month: 'January 2025', quantity: 210, quantityContract: 35, price: 215, priceContract: 210 }
                    ]} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" label={{ value: 'Price £/t', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Quantity t', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Bar yAxisId="right" dataKey="quantity" name="Quantity" fill="#000000" />
                      <Bar yAxisId="right" dataKey="quantityContract" name="Quantity (contract)" fill="#666666" />
                      <Bar yAxisId="left" dataKey="price" name="Price" fill="#999999" />
                      <Bar yAxisId="left" dataKey="priceContract" name="Price (contract)" fill="#CCCCCC" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <div>
                        <div className="text-sm text-gray-600">Sold</div>
                        <div className="font-bold">2436.00 t</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Remaining</div>
                        <div className="font-bold">2643.79 t</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-600 h-2 rounded-full" style={{ width: '48%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Min price</span>
                        <HelpCircle size={16} className="text-gray-400" />
                      </div>
                      <div className="font-bold">£200.00/t</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Avg. price</span>
                        <HelpCircle size={16} className="text-gray-400" />
                      </div>
                      <div className="font-bold">£219.17/t</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Max price</span>
                        <HelpCircle size={16} className="text-gray-400" />
                      </div>
                      <div className="font-bold">£250.00/t</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">£ achieved</span>
                        <HelpCircle size={16} className="text-gray-400" />
                      </div>
                      <div className="font-bold">£0.00</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Potential value left to sell</span>
                        <HelpCircle size={16} className="text-gray-400" />
                      </div>
                      <div className="font-bold">£579430.84</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Total potential value</span>
                        <HelpCircle size={16} className="text-gray-400" />
                      </div>
                      <div className="font-bold">£1113320.84</div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 py-2 bg-gray-900 text-white rounded-lg">
                    View sales / contracts →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
