import { X, Search } from 'lucide-react';
import { useState } from 'react';
import { UserFieldGroup, FmsFieldGroup } from '../../types';
import { FieldData } from '../../data/fieldData';

interface ViewFieldGroupPanelProps {
  isOpen: boolean;
  onClose: () => void;
  group: UserFieldGroup | FmsFieldGroup | null;
  allFields: FieldData[];
}

export default function ViewFieldGroupPanel({
  isOpen,
  onClose,
  group,
  allFields,
}: ViewFieldGroupPanelProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cropFilter, setCropFilter] = useState<string>('');

  if (!isOpen || !group) return null;

  const isUserGroup = !('readonly' in group);
  const isFmsCopy = (group as UserFieldGroup).isFmsCopy;
  const originalFmsId = (group as UserFieldGroup).originalFmsId;

  // Get fields in this group
  const groupFields = group.fieldIds
    .map(id => allFields.find(f => f.id === id))
    .filter((f): f is FieldData => f !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalSize = groupFields.reduce((sum, field) => sum + field.size, 0);

  // Get unique crop types for current fields
  const uniqueCrops = Array.from(new Set(
    groupFields.map(field => field.rotations['2024']).filter(Boolean)
  )) as string[];

  // Filter fields based on search and crop
  const filteredFields = searchQuery || cropFilter
    ? groupFields.filter(field => {
        const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCrop = !cropFilter || field.rotations['2024'] === cropFilter;
        return matchesSearch && matchesCrop;
      })
    : groupFields;

  return (
    <div className="fixed inset-y-0 right-0 w-112 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">View Field Group</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Group Summary */}
        <div className="mb-6 space-y-4">
          {/* Basic Info */}
          <div>
            <h3 className="font-medium mb-2">Group Name</h3>
            <p className="p-2 bg-gray-50 rounded flex justify-between items-center">
              <span>{group.name}</span>
              <span className="text-sm">
                {isUserGroup ? (
                  isFmsCopy ? (
                    <span className="text-gray-600">Copied from FMS</span>
                  ) : (
                    <span className="text-green-600">User Group</span>
                  )
                ) : (
                  <span className="text-blue-600">FMS Group</span>
                )}
              </span>
            </p>
          </div>

          {/* Total Area */}
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-600 mb-1">Total Area</div>
            <div className="text-xl font-semibold">{totalSize.toFixed(1)} ha</div>
          </div>

          {/* Source Info */}
          {(isFmsCopy || originalFmsId) && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
              Copied from FMS group: {originalFmsId}
            </div>
          )}
        </div>

        {/* Fields List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {/* Search Box */}
            <div className="relative flex-grow">
              <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fields..."
                className="w-full border border-gray-300 rounded-md pl-8 pr-2 py-2 text-sm"
              />
            </div>
            {/* Crop Filter */}
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-2 text-sm min-w-[120px]"
            >
              <option value="">All Crops</option>
              {uniqueCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <div className="border border-gray-200 rounded-md overflow-y-auto max-h-[calc(100vh-380px)]">
            {filteredFields.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                {searchQuery ? 'No fields match your search' : 'No fields in this group'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredFields.map(field => (
                  <div
                    key={field.id}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{field.name}</span>
                        <span className="text-sm text-gray-600">
                          ({field.size.toFixed(1)} ha)
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {field.rotations['2024'] || 'No crop'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}