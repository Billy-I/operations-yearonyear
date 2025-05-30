import React from 'react';
import { UploadCloud } from 'lucide-react';

const UploadDataPromptWidget: React.FC = () => {
  const handleUploadNow = () => {
    // Placeholder: Implement navigation to data upload page
    console.log('Navigate to data upload page');
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col items-start">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Upload data
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload your farm's data to make the most of the platform, if you haven't already.
        </p>
        <button
          onClick={handleUploadNow}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Upload your farm data now"
        >
          <UploadCloud size={18} />
          Upload Now
        </button>
      </div>
    </div>
  );
};

export default UploadDataPromptWidget;