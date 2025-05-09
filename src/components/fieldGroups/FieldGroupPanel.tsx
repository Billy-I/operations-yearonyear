import { X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UserFieldGroup } from '../../types';
import { FieldData } from '../../data/fieldData';

interface FieldGroupPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: UserFieldGroup) => void;
  initialData: Partial<UserFieldGroup> | null;
  allFields: FieldData[];
  allUserGroups: UserFieldGroup[]; // Add all user groups to check membership
  mode: 'create' | 'edit' | 'copy';
}

// Utility function to find which groups a field belongs to
const getFieldGroupMemberships = (
  fieldId: string,
  groups: UserFieldGroup[],
  currentGroupId?: string // Exclude current group when editing
): UserFieldGroup[] => {
  return groups.filter(group =>
    group.id !== currentGroupId && // Exclude current group
    group.fieldIds.includes(fieldId)
  );
};

export default function FieldGroupPanel({
  isOpen,
  onClose,
  onSave,
  initialData,
  allFields,
  allUserGroups,
  mode
}: FieldGroupPanelProps) {
  // Form state
  const [groupName, setGroupName] = useState<string>('');
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setGroupName(initialData.name || '');
      setSelectedFieldIds(initialData.fieldIds || []);
    } else {
      setGroupName('');
      setSelectedFieldIds([]);
    }
    setSearchQuery('');
    setError(null);
  }, [initialData]);

  if (!isOpen) return null;

  // Filter fields based on search query
  const filteredFields = allFields
    .filter(field => field.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFieldIds(current =>
      current.includes(fieldId)
        ? current.filter(id => id !== fieldId)
        : [...current, fieldId]
    );
  };

  const handleSave = () => {
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }
    if (selectedFieldIds.length === 0) {
      setError('Please select at least one field');
      return;
    }

    const groupToSave: UserFieldGroup = {
      id: initialData?.id || '',
      name: groupName.trim(),
      fieldIds: selectedFieldIds,
      isFmsCopy: initialData?.isFmsCopy,
      originalFmsId: initialData?.originalFmsId,
    };

    onSave(groupToSave);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-112 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {mode === 'create' ? 'Create New Field Group' :
             mode === 'edit' ? 'Edit Field Group' :
             'Copy Field Group'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {/* Group Name Input */}
        <div className="mb-6">
          <label htmlFor="groupName" className="block font-medium mb-2">
            Group Name
          </label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter group name"
          />
        </div>

        {/* Field Selection */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium">
              Select Fields ({selectedFieldIds.length} selected)
            </label>
          </div>
          
          {/* Search Box */}
          <div className="mb-3">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fields..."
                className="w-full border border-gray-300 rounded-md pl-8 pr-2 py-2 text-sm"
              />
            </div>
          </div>

          {/* Fields List */}
          <div className="border border-gray-200 rounded-md overflow-y-auto max-h-[calc(100vh-380px)] min-h-[300px] bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
            {filteredFields.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                No fields match your criteria
              </div>
            ) : (
              <div className="divide-y divide-gray-200 bg-white">
                {filteredFields.map(field => (
                  <label
                    key={field.id}
                    className="flex items-center px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFieldIds.includes(field.id)}
                      onChange={() => handleFieldToggle(field.id)}
                      className="mr-3"
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{field.name}</span>
                          <span className="text-sm text-gray-600">({field.size.toFixed(1)} ha)</span>
                        </div>
                        {/* Show group memberships */}
                        {(() => {
                          const memberships = getFieldGroupMemberships(field.id, allUserGroups, initialData?.id);
                          if (memberships.length > 0) {
                            return (
                              <span className="text-xs text-gray-500 mt-0.5">
                                In groups: {memberships.map(g => g.name).join(', ')}
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={!groupName.trim() || selectedFieldIds.length === 0}
          >
            {mode === 'edit' ? 'Save Changes' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
}