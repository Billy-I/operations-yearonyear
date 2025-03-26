import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface FeatureNotificationProps {
  title: string;
  message: React.ReactNode;
  onLearnMore?: () => void;
  onDismiss?: () => void;
  persistent?: boolean;
}

const FeatureNotification: React.FC<FeatureNotificationProps> = ({
  title,
  message,
  onLearnMore,
  onDismiss,
  persistent = false
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed && !persistent) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Info size={18} className="text-gray-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
          <div className="mt-1 text-sm text-gray-700">
            {message}
          </div>
          {onLearnMore && (
            <div className="mt-2">
              <button
                type="button"
                onClick={onLearnMore}
                className="text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
              >
                Learn more
              </button>
            </div>
          )}
        </div>
        {!persistent && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Dismiss</span>
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureNotification;