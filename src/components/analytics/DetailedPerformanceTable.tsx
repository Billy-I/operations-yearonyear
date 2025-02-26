import React, { useState, useMemo } from 'react';
import { ArrowUpDown, HelpCircle } from 'lucide-react';
import { MetricsData, Year } from '../../types/analytics';

interface PerformanceData {
  name: string;
  area: string;
  costPerTonne: string;
  performance: number;
  yield: string;
  costPerHa: string;
  grossMargin: string;
  netMargin?: string;
}

interface ColumnVisibility {
  area: boolean;
  costPerTonne: boolean;
  performance: boolean;
  yield: boolean;
  costPerHa: boolean;
  margin: boolean;
}

interface DetailedPerformanceTableProps {
  data: PerformanceData[];
  metricsData: MetricsData;
  selectedYear: Year;
  groupBy: 'Variety' | 'Field' | 'Region';
  showNetMargin?: boolean;
  visibleColumns: ColumnVisibility;
}

type SortField = 'name' | 'area' | 'costPerTonne' | 'performance' | 'yield' | 'costPerHa' | 'margin';
type SortDirection = 'asc' | 'desc';

export default function DetailedPerformanceTable({
  data,
  metricsData,
  selectedYear,
  groupBy,
  showNetMargin = false,
  visibleColumns
}: DetailedPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let compareA: string | number;
      let compareB: string | number;

      switch (sortField) {
        case 'name':
          compareA = a.name;
          compareB = b.name;
          break;
        case 'area':
          compareA = parseFloat(a.area);
          compareB = parseFloat(b.area);
          break;
        case 'costPerTonne':
          compareA = parseFloat(a.costPerTonne.replace(/[£,]/g, ''));
          compareB = parseFloat(b.costPerTonne.replace(/[£,]/g, ''));
          break;
        case 'performance':
          compareA = a.performance;
          compareB = b.performance;
          break;
        case 'yield':
          compareA = parseFloat(a.yield);
          compareB = parseFloat(b.yield);
          break;
        case 'costPerHa':
          compareA = parseFloat(a.costPerHa.replace(/[£,]/g, ''));
          compareB = parseFloat(b.costPerHa.replace(/[£,]/g, ''));
          break;
        case 'margin':
          compareA = parseFloat((showNetMargin ? a.netMargin || '0' : a.grossMargin).replace(/[£,]/g, ''));
          compareB = parseFloat((showNetMargin ? b.netMargin || '0' : b.grossMargin).replace(/[£,]/g, ''));
          break;
        default:
          return 0;
      }

      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection, showNetMargin]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold">Performance by {groupBy}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {/* Name column is always visible */}
              <th
                onClick={() => toggleSort('name')}
                className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer group"
              >
                <div className="flex items-center space-x-2">
                  <span>{groupBy}</span>
                  <ArrowUpDown size={14} className={`transition-opacity ${sortField === 'name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  <div className="relative group/tooltip">
                    <HelpCircle size={14} className="text-gray-400 cursor-help" />
                    <div className="absolute z-10 invisible group-hover/tooltip:visible bg-black text-white text-xs rounded p-2 w-48 left-0 mt-1">
                      Click to sort by {groupBy.toLowerCase()} name
                    </div>
                  </div>
                </div>
              </th>
              
              {visibleColumns.area && (
                <th
                  onClick={() => toggleSort('area')}
                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer group"
                >
                  <div className="flex items-center space-x-2">
                    <span>Area</span>
                    <ArrowUpDown size={14} className={`transition-opacity ${sortField === 'area' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
                </th>
              )}
              
              {visibleColumns.costPerTonne && (
                <th
                  onClick={() => toggleSort('costPerTonne')}
                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer group"
                >
                  <div className="flex items-center space-x-2">
                    <span>Cost(£/t)</span>
                    <ArrowUpDown size={14} className={`transition-opacity ${sortField === 'costPerTonne' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                    <div className="relative group/tooltip">
                      <HelpCircle size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute z-10 invisible group-hover/tooltip:visible bg-black text-white text-xs rounded p-2 w-48 left-0 mt-1">
                        Total cost per tonne including all variable and operation costs
                      </div>
                    </div>
                  </div>
                </th>
              )}
              
              {visibleColumns.performance && (
                <th
                  onClick={() => toggleSort('performance')}
                  className="text-center py-3 px-4 font-medium text-gray-600 cursor-pointer group"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Performance</span>
                    <ArrowUpDown size={14} className={`transition-opacity ${sortField === 'performance' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                    <div className="relative group/tooltip">
                      <HelpCircle size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute z-10 invisible group-hover/tooltip:visible bg-black text-white text-xs rounded p-2 w-48 left-0 mt-1">
                        Performance relative to market benchmarks
                      </div>
                    </div>
                  </div>
                </th>
              )}
              
              {visibleColumns.yield && (
                <th
                  onClick={() => toggleSort('yield')}
                  className="text-right py-3 px-4 font-medium text-gray-600 cursor-pointer group"
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span>Yield</span>
                    <ArrowUpDown size={14} className={`transition-opacity ${sortField === 'yield' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
                </th>
              )}
              
              {visibleColumns.costPerHa && (
                <th
                  onClick={() => toggleSort('costPerHa')}
                  className="text-right py-3 px-4 font-medium text-gray-600 cursor-pointer group"
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span>Cost(£/ha)</span>
                    <ArrowUpDown size={14} className={`transition-opacity ${sortField === 'costPerHa' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                    <div className="relative group/tooltip">
                      <HelpCircle size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute z-10 invisible group-hover/tooltip:visible bg-black text-white text-xs rounded p-2 w-48 right-0 mt-1">
                        Total cost per hectare including all variable and operation costs
                      </div>
                    </div>
                  </div>
                </th>
              )}
              
              {visibleColumns.margin && (
                <th
                  onClick={() => toggleSort('margin')}
                  className="text-right py-3 px-4 font-medium text-gray-600 cursor-pointer group"
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span>{showNetMargin ? 'Net margin' : 'GM'}</span>
                    <ArrowUpDown size={14} className={`transition-opacity ${sortField === 'margin' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                    <div className="relative group/tooltip">
                      <HelpCircle size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute z-10 invisible group-hover/tooltip:visible bg-black text-white text-xs rounded p-2 w-48 right-0 mt-1">
                        {showNetMargin ? 'Net margin = Gross margin - Operation costs' : 'Gross margin = Revenue - Variable costs'}
                      </div>
                    </div>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.name} className="border-b border-gray-100">
                {/* Name column is always visible */}
                <td className="py-3 px-4">
                  {item.name}
                </td>
                
                {visibleColumns.area && (
                  <td className="py-3 px-4">{item.area}</td>
                )}
                
                {visibleColumns.costPerTonne && (
                  <td className="py-3 px-4">{item.costPerTonne}</td>
                )}
                
                {visibleColumns.performance && (
                  <td className="py-3 px-4">
                    <div className="w-32 h-2 bg-gray-100 rounded-full mx-auto relative overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gray-600 rounded-full"
                        style={{ width: `${item.performance}%` }}
                      ></div>
                    </div>
                  </td>
                )}
                
                {visibleColumns.yield && (
                  <td className="text-right py-3 px-4">{item.yield}</td>
                )}
                
                {visibleColumns.costPerHa && (
                  <td className="text-right py-3 px-4">{item.costPerHa}</td>
                )}
                
                {visibleColumns.margin && (
                  <td className="text-right py-3 px-4">
                    {showNetMargin ? item.netMargin : item.grossMargin}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
