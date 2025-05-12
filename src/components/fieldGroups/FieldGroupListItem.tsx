import React from 'react';
import { UserFieldGroup, FmsFieldGroup } from '../../types';
import { Eye, Copy, Edit2, Trash2, Lock, Ruler } from 'lucide-react';
import { getTotalGroupSize } from '../../utils/fieldCalculations';
import { fieldsData, FieldData } from '../../data/fieldData';

interface FieldGroupListItemProps {
  group: UserFieldGroup | FmsFieldGroup;
  onEdit?: (group: UserFieldGroup) => void; // Only for user groups
  onCopy: (group: UserFieldGroup | FmsFieldGroup) => void;
  onDelete?: (groupId: string) => void; // Only for user groups
  onView: (group: UserFieldGroup | FmsFieldGroup) => void;
}

export default function FieldGroupListItem({
  group,
  onEdit,
  onCopy,
  onDelete,
  onView,
}: FieldGroupListItemProps) {
  // Check if this is an FMS group (readonly)
  const isFmsGroup = 'readonly' in group && group.readonly === true;

  // Calculate total size
  const totalSize = getTotalGroupSize(
    group.fieldIds
      .map(id => fieldsData.find(f => f.id === id))
      .filter((f): f is FieldData => f !== undefined)
  );
  
  return (
    <div className={`p-3 border rounded shadow-sm flex justify-between items-start ${
      isFmsGroup ? 'bg-gray-50' : 'bg-white'
    }`}>
      <div className="space-y-1">
        <div className="flex items-center space-x-3">
          <span className="font-medium">{group.name}</span>
          {isFmsGroup && (
            <span className="flex items-center text-gray-400 text-sm" title="Imported (Read-only)">
              <Lock size={14} className="mr-1" />
              FMS
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>
            {group.fieldIds.length} field{group.fieldIds.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center">
            <Ruler size={14} className="inline mr-1" />
            {totalSize.toFixed(1)} ha
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* View button - available for all groups */}
        <button
          onClick={() => onView(group)}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="View Details"
        >
          <Eye size={16} />
        </button>

        {/* Copy button - available for all groups */}
        <button
          onClick={() => onCopy(group)}
          className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
          title="Copy Group"
        >
          <Copy size={16} />
        </button>

        {/* Edit button - only for user groups */}
        {!isFmsGroup && onEdit && (
          <button
            onClick={() => onEdit(group as UserFieldGroup)}
            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
            title="Edit Group"
          >
            <Edit2 size={16} />
          </button>
        )}

        {/* Delete button - only for user groups */}
        {!isFmsGroup && onDelete && (
          <button
            onClick={() => onDelete(group.id)}
            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            title="Delete Group"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}