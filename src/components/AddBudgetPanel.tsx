import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddBudgetPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AddBudgetPanel: React.FC<AddBudgetPanelProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    crop: '',
    // Variable costs
    area: '',
    seed: '',
    fertiliser: '',
    chemical: '',
    yield: '',
    price: '',
    // Operation costs
    cultivation: '',
    drilling: '',
    application: '',
    harvesting: '',
    other: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit both variable and operation costs
    const variableCosts = {
      type: 'variable',
      crop: formData.crop,
      area: formData.area || '0',
      seed: formData.seed || '0',
      fertiliser: formData.fertiliser || '0',
      chemical: formData.chemical || '0',
      yield: formData.yield || '0',
      price: formData.price || '0'
    };

    const operationCosts = {
      type: 'operations',
      crop: formData.crop,
      cultivation: formData.cultivation || '0',
      drilling: formData.drilling || '0',
      application: formData.application || '0',
      harvesting: formData.harvesting || '0',
      other: formData.other || '0'
    };

    // Submit both sets of data
    onAdd(variableCosts);
    onAdd(operationCosts);

    // Reset form
    setFormData({
      crop: '',
      area: '',
      seed: '',
      fertiliser: '',
      chemical: '',
      yield: '',
      price: '',
      cultivation: '',
      drilling: '',
      application: '',
      harvesting: '',
      other: ''
    });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-gray-900">Add Budget</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                <input
                  type="text"
                  name="crop"
                  value={formData.crop}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Variable Costs</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area (ha)</label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seed (£/ha)</label>
                    <input
                      type="number"
                      name="seed"
                      value={formData.seed}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fertiliser (£/ha)</label>
                    <input
                      type="number"
                      name="fertiliser"
                      value={formData.fertiliser}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chemical (£/ha)</label>
                    <input
                      type="number"
                      name="chemical"
                      value={formData.chemical}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yield (t/ha)</label>
                    <input
                      type="number"
                      name="yield"
                      value={formData.yield}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (£/t)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Operation Costs</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cultivation (£)</label>
                    <input
                      type="number"
                      name="cultivation"
                      value={formData.cultivation}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Drilling (£)</label>
                    <input
                      type="number"
                      name="drilling"
                      value={formData.drilling}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application (£)</label>
                    <input
                      type="number"
                      name="application"
                      value={formData.application}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harvesting (£)</label>
                    <input
                      type="number"
                      name="harvesting"
                      value={formData.harvesting}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other (£)</label>
                    <input
                      type="number"
                      name="other"
                      value={formData.other}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Add Budget
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetPanel;