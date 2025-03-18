import React from 'react';
import { RotateCcw } from 'lucide-react';

export interface ChangeLogEntry {
  id: string;
  timestamp: Date;
  category: string;
  operationName: string;
  oldValue: number;
  newValue: number;
  isSubOperation: boolean;
}

interface ChangeLogProps {
  changes: ChangeLogEntry[];
  onUndoChange: (changeId: string) => void;
  onClearChanges: () => void;
}

export default function ChangeLog({ changes, onUndoChange, onClearChanges }: ChangeLogProps) {
  if (changes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">Changes Made</h2>
        <button 
          onClick={onClearChanges}
          className="text-sm px-3 py-1 text-gray-600 hover:text-gray-800 flex items-center"
        >
          <RotateCcw size={14} className="mr-1" />
          Reset All
        </button>
      </div>
      
      <div className="max-h-60 overflow-y-auto">
        {changes.map((change) => (
          <div 
            key={change.id} 
            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <div className="font-medium">
                {change.category}: {change.operationName}
                {change.isSubOperation && <span className="text-xs ml-1 text-gray-500">(sub-operation)</span>}
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                <span className="line-through mr-2">£{change.oldValue.toFixed(2)}</span>
                <span className="text-blue-600">→</span>
                <span className="ml-2 text-blue-600 font-medium">£{change.newValue.toFixed(2)}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {formatTimestamp(change.timestamp)}
                </span>
              </div>
            </div>
            <button
              onClick={() => onUndoChange(change.id)}
              className="text-sm px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            >
              Undo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return 'just now';
  } else if (diffSec < 3600) {
    const mins = Math.floor(diffSec / 60);
    return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
  } else if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}