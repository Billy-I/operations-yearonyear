import { X, Search, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import { UserFieldGroup, FmsFieldGroup } from '../../types';
import { FieldData } from '../../data/fieldData';

interface ViewFieldGroupPanelProps {
  isOpen: boolean;
  onClose: () => void;
  group: UserFieldGroup | FmsFieldGroup | null;
  allFields: FieldData[];
  allUserGroups: UserFieldGroup[];
}

// Utility function to find which groups a field belongs to
const getFieldGroupMemberships = (
  fieldId: string,
  groups: UserFieldGroup[],
  currentGroupId: string
): UserFieldGroup[] => {
  return groups.filter(group =>
    group.id !== currentGroupId &&
    group.fieldIds.includes(fieldId)
  );
};

export default function ViewFieldGroupPanel({
  isOpen,
  onClose,
  group,
  allFields,
  allUserGroups,
}: ViewFieldGroupPanelProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen || !group) return null;

  const isUserGroup = !('readonly' in group);
  const isFmsCopy = (group as UserFieldGroup).isFmsCopy;
  const originalFmsId = (group as UserFieldGroup).originalFmsId;

  // Get fields in this group
  const groupFields = group.fieldIds
    .map(id => allFields.find(f => f.id === id))
    .filter((f): f is FieldData => f !== undefined);

  const totalSize = groupFields.reduce((sum, field) => sum + field.size, 0);

  // Get unique crop types for current fields
  const uniqueCrops = Array.from(new Set(
    groupFields.map(field => field.rotations['2024']).filter(Boolean)
  )) as string[];

  // Filter fields based on search and crop
  const filteredFields = searchQuery
    ? groupFields.filter(field =>
        field.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : groupFields;

  const sortedAndFilteredFields = [...filteredFields].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
    <div className={`fixed inset-y-0 right-0 ${isExpanded ? 'w-[60rem]' : 'w-96'} bg-white shadow-lg z-50 overflow-y-auto transition-all duration-300 ease-in-out`}>
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
          <div className="flex justify-between items-center mb-3">
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
            <div className="flex items-center gap-2 ml-3">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
                title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
              >
                Sort ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title={isExpanded ? "Collapse View" : "Expand View"}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md overflow-y-auto max-h-[calc(100vh-420px)] min-h-[200px] bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
            {sortedAndFilteredFields.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                {searchQuery ? 'No fields match your search' : 'No fields in this group'}
              </div>
            ) : (
              <div className={`grid ${isExpanded ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-2 p-2 bg-white`}>
                {sortedAndFilteredFields.map(field => (
                  <div
                    key={field.id}
                    className="px-3 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex flex-col overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate" title={field.name}>{field.name}</span>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          ({field.size.toFixed(1)} ha)
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 truncate" title={field.rotations['2024'] || 'No crop'}>
                        {field.rotations['2024'] || 'No crop'}
                      </span>
                      {/* Show group memberships */}
                      {(() => {
                        const memberships = getFieldGroupMemberships(field.id, allUserGroups, group.id);
                        if (memberships.length > 0) {
                          const groupNames = memberships.map(g => g.name).join(', ');
                          return (
                            <span className="text-xs text-gray-500 mt-0.5 truncate" title={`Also in groups: ${groupNames}`}>
                              Also in groups: {groupNames}
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
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