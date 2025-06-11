import React, { useState } from 'react';
import { MockExplorerSnapshotDataType, ExplorerCropYearData } from '../../data/dashboardMockData'; // Adjust path as needed

interface ExplorerSnapshotWidgetProps {
  snapshotData: MockExplorerSnapshotDataType;
}

const ExplorerSnapshotWidget: React.FC<ExplorerSnapshotWidgetProps> = ({ snapshotData }) => {
  const cropIds = Object.keys(snapshotData);
  const [selectedCropId, setSelectedCropId] = useState<string>(cropIds[0] || '');

  const selectedCropData: ExplorerCropYearData | undefined = snapshotData[selectedCropId];

  const handleCropChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCropId(event.target.value);
  };

  if (!selectedCropData) {
    return (
      <div 
        className="p-6 h-full flex flex-col"
        style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Previous Year Crop Highlights</h3>
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  return (
    <div 
      className="p-6 h-full flex flex-col"
      style={{
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Previous Year Crop Highlights</h3>
        {cropIds.length > 1 && (
          <select 
            value={selectedCropId}
            onChange={handleCropChange}
            className="p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              background: '#FFFFFF',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            {cropIds.map(cropId => (
              <option key={cropId} value={cropId}>
                {snapshotData[cropId].cropName}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <p className="text-sm text-gray-500 mb-3">Showing data for: <span className="font-semibold">{selectedCropData.cropName} ({selectedCropData.harvestYear} Harvest)</span></p>

      <div className="space-y-2 flex-grow overflow-y-auto" style={{ maxHeight: '200px' }}> {/* Added max height and scroll */}
        {selectedCropData.metrics.map((metric, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center p-2 transition-colors hover:bg-gray-100"
            style={{
              background: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E5E7EB'
            }}
          >
            <p className="text-sm text-gray-700 font-medium">{metric.label}:</p>
            <p className="text-sm text-gray-900 font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      <button 
        className="mt-4 w-full text-white font-semibold py-2 px-4 transition duration-150 ease-in-out"
        style={{
          backgroundColor: 'var(--yagro-brand)',
          borderRadius: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--yagro-brand-dark)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--yagro-brand)';
        }}
      >
        Explore Full Previous Year Data
      </button>
    </div>
  );
};

export default ExplorerSnapshotWidget;
