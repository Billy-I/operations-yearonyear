import React, { useState } from 'react';
import { OperationsData, Operation } from '../types';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';

interface CustomizationItem {
  category: string;
  operation: string;
  crop: string;
  customValue: number;
  defaultValue: number;
  isSubOperation: boolean;
}

interface CustomizationsOverviewProps {
  data: OperationsData;
  defaultData: OperationsData;
  onResetCustomization: (category: string, operationName: string, crop: string, isSubOperation: boolean) => void;
}

export default function CustomizationsOverview({
  data,
  defaultData,
  onResetCustomization
}: CustomizationsOverviewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'crops' | 'operations'>('all');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Find all customizations by comparing current data with default data
  const customizations = findCustomizations(data, defaultData);
  
  // Filter customizations based on search term and filter type
  const filteredCustomizations = customizations.filter(item => {
    const matchesSearch = 
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'crops') return matchesSearch && item.crop !== 'All crops';
    if (filterType === 'operations') return matchesSearch;
    
    return matchesSearch;
  });
  
  // Group customizations by crop
  const groupedByCrop: Record<string, CustomizationItem[]> = {};
  filteredCustomizations.forEach(item => {
    if (!groupedByCrop[item.crop]) {
      groupedByCrop[item.crop] = [];
    }
    groupedByCrop[item.crop].push(item);
  });
  
  // Determine what to render based on customizations and collapsed state
  const renderContent = () => {
    if (customizations.length === 0) {
      return (
        <p className="text-gray-600">No customizations have been made. All values are using default settings.</p>
      );
    }
    
    if (isCollapsed) {
      return (
        <div className="text-sm text-gray-500">
          {customizations.length} customizations found. Click to expand.
        </div>
      );
    }
    
    return (
      <>
        <div className="p-4 border-b border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Search size={16} className="absolute left-2 top-2 text-gray-400" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="all">All</option>
                <option value="crops">By Crop</option>
                <option value="operations">By Operation</option>
              </select>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            This panel shows all operations that have been customized from their default values,
            regardless of when they were modified. Use this to see which operations are using custom values.
          </p>
          
          <div className="text-sm text-gray-500 mb-2">
            {filteredCustomizations.length} customizations found
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedByCrop).map(([crop, items]) => (
            <div key={crop} className="border-b border-blue-100 last:border-0">
              <div className="px-4 py-2 bg-blue-100 font-medium text-blue-800">{crop}</div>
              <div>
                {items.map((item, index) => (
                  <div
                    key={`${item.category}-${item.operation}-${index}`}
                    className="px-4 py-3 border-t border-blue-100 flex justify-between items-center hover:bg-blue-50"
                  >
                    <div>
                      <div className="font-medium text-blue-900">
                        {item.category}: {item.operation}
                        {item.isSubOperation && <span className="text-xs ml-1 text-blue-600">(sub-operation)</span>}
                      </div>
                      <div className="text-sm flex items-center mt-1">
                        <span className="line-through mr-2 text-gray-500">£{item.defaultValue.toFixed(2)}</span>
                        <span className="text-blue-600">→</span>
                        <span className="ml-2 text-blue-700 font-medium">£{item.customValue.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onResetCustomization(
                        item.category,
                        item.operation,
                        item.crop,
                        item.isSubOperation
                      )}
                      className="text-sm px-3 py-1 text-blue-700 border border-blue-300 hover:bg-blue-100 rounded"
                    >
                      Reset
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg shadow mb-6">
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-lg font-medium text-blue-800">
          Customizations Overview
        </h2>
        <div>
          {isCollapsed ?
            <ChevronRight size={20} className="text-blue-800" /> :
            <ChevronDown size={20} className="text-blue-800" />
          }
        </div>
      </div>
      
      {!isCollapsed && customizations.length > 0 && (
        <div className="border-t border-blue-200">
          {renderContent()}
        </div>
      )}
      
      {(isCollapsed || customizations.length === 0) && (
        <div className="px-4 pb-4">
          {renderContent()}
        </div>
      )}
    </div>
  );
}

// Helper function to find all customizations
function findCustomizations(data: OperationsData, defaultData: OperationsData): CustomizationItem[] {
  const customizations: CustomizationItem[] = [];
  const categories: (keyof OperationsData)[] = ['cultivation', 'drilling', 'application', 'harvesting', 'other'];
  
  // Check all crops
  Object.keys(data.crops).forEach(cropName => {
    // Check each operation category
    categories.forEach(category => {
      const currentOperation = data[category] as Operation;
      const defaultOperation = defaultData[category] as Operation;
      
      // Skip if operation doesn't exist
      if (!currentOperation || !defaultOperation) return;
      
      // Check main operation
      if (currentOperation.cropData?.[cropName] && defaultOperation.cropData?.[cropName]) {
        const currentValue = currentOperation.cropData[cropName].costPerHa;
        const defaultValue = defaultOperation.cropData[cropName].costPerHa;
        
        // Use a small epsilon for floating point comparison
        const epsilon = 0.001;
        if (Math.abs(currentValue - defaultValue) > epsilon) {
          customizations.push({
            category: currentOperation.name,
            operation: currentOperation.name,
            crop: cropName,
            customValue: currentValue,
            defaultValue: defaultValue,
            isSubOperation: false
          });
        }
      }
      
      // Check sub-operations
      if (currentOperation.subOperations && defaultOperation.subOperations) {
        currentOperation.subOperations.forEach(subOp => {
          if (subOp.cropData?.[cropName]) {
            // Find matching sub-operation in default data
            const defaultSubOp = defaultOperation.subOperations?.find(op => op.name === subOp.name);
            
            if (defaultSubOp?.cropData?.[cropName]) {
              const currentValue = subOp.cropData[cropName].costPerHa;
              const defaultValue = defaultSubOp.cropData[cropName].costPerHa;
              
              // Use a small epsilon for floating point comparison
              const epsilon = 0.001;
              if (Math.abs(currentValue - defaultValue) > epsilon) {
                customizations.push({
                  category: currentOperation.name,
                  operation: subOp.name,
                  crop: cropName,
                  customValue: currentValue,
                  defaultValue: defaultValue,
                  isSubOperation: true
                });
              }
            }
          }
        });
      }
    });
  });
  
  // Sort customizations by crop, then category, then operation
  return customizations.sort((a, b) => {
    if (a.crop !== b.crop) return a.crop.localeCompare(b.crop);
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.operation.localeCompare(b.operation);
  });
}