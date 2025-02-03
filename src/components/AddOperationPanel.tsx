import { X } from 'lucide-react';
import { useState } from 'react';
import { Operation } from '../types';

interface AddOperationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (operation: Omit<Operation, 'totalCost'>) => void;
  categoryName: string;
  existingOperations: string[];
}

const predefinedOperations = {
  'Cultivation': ['Ploughing', 'Discing', 'Rolling', 'Harrowing'],
  'Drilling': ['Seed drilling', 'Fertilizer application', 'Direct drilling'],
  'Application - Fert.': ['Nitrogen application', 'Phosphate application', 'Potash application'],
  'Harvesting': ['Combine harvesting', 'Grain carting', 'Baling'],
  'Other': ['Crop walking', 'Field margin maintenance', 'Soil sampling']
};

export default function AddOperationPanel({ isOpen, onClose, onAdd, categoryName, existingOperations }: AddOperationPanelProps) {
  const [operationType, setOperationType] = useState<'list' | 'other'>('list');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [customOperation, setCustomOperation] = useState('');
  const [costPerHa, setCostPerHa] = useState('');

  // Filter out existing operations from the predefined list
  const availableOperations = predefinedOperations[categoryName as keyof typeof predefinedOperations]?.filter(
    op => !existingOperations.includes(op)
  ) || [];

  const handleSubmit = () => {
    const operationName = operationType === 'list' ? selectedOperation : customOperation;
    if (!operationName || !costPerHa) return;

    onAdd({
      name: operationName,
      costPerHa: parseFloat(costPerHa),
      cropData: {
        'All crops': { hectares: 54, costPerHa: parseFloat(costPerHa), totalCost: parseFloat(costPerHa) * 54 },
        'Barley': { hectares: 15, costPerHa: parseFloat(costPerHa), totalCost: parseFloat(costPerHa) * 15 },
        'Wheat (Winter)': { hectares: 25, costPerHa: parseFloat(costPerHa), totalCost: parseFloat(costPerHa) * 25 },
        'Linseed': { hectares: 14, costPerHa: parseFloat(costPerHa), totalCost: parseFloat(costPerHa) * 14 }
      }
    });
    
    // Reset form
    setOperationType('list');
    setSelectedOperation('');
    setCustomOperation('');
    setCostPerHa('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Operation to {categoryName}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="font-medium mb-3">Operation Type</p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={operationType === 'list'}
                  onChange={() => setOperationType('list')}
                  className="form-radio"
                  disabled={availableOperations.length === 0}
                />
                <span>Choose from list</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={operationType === 'other'}
                  onChange={() => setOperationType('other')}
                  className="form-radio"
                />
                <span>Other</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Operation Name</label>
            {operationType === 'list' ? (
              <select
                value={selectedOperation}
                onChange={(e) => setSelectedOperation(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select an operation</option>
                {availableOperations.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customOperation}
                onChange={(e) => setCustomOperation(e.target.value)}
                placeholder="Enter operation name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            )}
          </div>

          <div>
            <label className="block font-medium mb-2">Cost per Hectare (£/ha)</label>
            <input
              type="number"
              value={costPerHa}
              onChange={(e) => setCostPerHa(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!((operationType === 'list' && selectedOperation) || (operationType === 'other' && customOperation)) || !costPerHa}
            className="w-full bg-gray-600 text-white py-3 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add Operation
          </button>
        </div>
      </div>
    </div>
  );
}