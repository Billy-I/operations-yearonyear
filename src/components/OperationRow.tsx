import { Trash2 } from 'lucide-react';
import { Operation } from '../types';
import { useState, useRef, useEffect } from 'react';

interface OperationRowProps {
  operation: Operation;
  isExpanded?: boolean;
  onToggle?: () => void;
  isExpandable?: boolean;
  onDelete?: () => void;
  onUpdateCost: (newCost: number) => void;
  isEditable?: boolean;
  isSubOperation?: boolean;
}

export default function OperationRow({
  operation,
  isExpanded,
  onToggle,
  isExpandable = false,
  onDelete,
  onUpdateCost,
  isEditable = true,
  isSubOperation = false
}: OperationRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(operation.costPerHa.toString());
  const [originalValue, setOriginalValue] = useState(operation.costPerHa);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(operation.costPerHa.toString());
      setOriginalValue(operation.costPerHa);
    }
  }, [operation.costPerHa, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = (e: React.MouseEvent) => {
    if (!isEditable) return;
    e.stopPropagation();
    setOriginalValue(operation.costPerHa);
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleSave = () => {
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue) && newValue >= 0) {
      onUpdateCost(newValue);
    } else {
      setEditValue(originalValue.toString());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(originalValue.toString());
    onUpdateCost(originalValue);
    setIsEditing(false);
  };

  return (
    <div
      className={`w-full border-b border-gray-200 ${
        isSubOperation ? 'bg-gray-50' : ''
      } ${isExpandable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={isExpandable ? onToggle : undefined}
    >
      <div className="flex items-center px-4 py-3">
        <div className="flex-1 flex items-center">
          {isExpandable && (
            <span className="mr-2 w-4 inline-block text-center">{isExpanded ? '▼' : '▶'}</span>
          )}
          <span>{operation.name}</span>
        </div>
        <div 
          className="w-48 text-right pr-12"
          onClick={(e) => e.stopPropagation()}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="w-24 text-right border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
              min="0"
            />
          ) : (
            <span 
              className={`${isEditable ? 'cursor-pointer hover:text-blue-600' : ''}`}
              onClick={handleEdit}
            >
              £{operation.costPerHa.toFixed(2)}/ha
            </span>
          )}
        </div>
        <div className="w-48 text-right pr-12">£{operation.totalCost.toFixed(2)}</div>
        <div className="w-10 flex justify-center">
          {onDelete && isEditable && (
            <button 
              className="p-1 hover:bg-gray-200 rounded text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}