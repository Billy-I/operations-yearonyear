import React from 'react';
import { KpiDataItem } from '../../data/dashboardMockData'; // Adjust path as needed
import { Link } from 'react-router-dom';
import {
  TrendingUp, CalendarClock, AlertTriangle, Users, Package, DollarSign, RefreshCw, // Main icons
  ArrowUpRight, ArrowDownRight, Minus, // Trend icons
  Sun, CloudRain, UploadCloud // Weather and Action icons
} from 'lucide-react';

// Mapping for main icons
const mainIconComponents: { [key: string]: React.ElementType } = {
  TrendingUp,
  CalendarClock,
  AlertTriangle,
  Users, // Example for 'Total User' if we add it
  Package, // Example for 'Total Order'
  DollarSign, // Example for 'Total Sales'
  RefreshCw, // Example for 'Total Pending'
  Sun,
  CloudRain,
  UploadCloud
};

// Mapping for trend icons
const trendIconComponents: { [key: string]: React.ElementType } = {
  ArrowUpRight,
  ArrowDownRight,
  Minus
};

interface KpiCardProps {
  kpi: KpiDataItem;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  const MainIcon = kpi.icon ? mainIconComponents[kpi.icon] || TrendingUp : TrendingUp;
  const TrendIcon = kpi.trendIcon ? trendIconComponents[kpi.trendIcon] : null;

  const cardContent = (
    <div 
      className={`p-5 flex flex-col justify-between h-full ${kpi.link ? 'transition-shadow duration-300 ease-in-out' : ''}`}
      style={{
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        boxShadow: kpi.link ? '0 1px 3px rgba(0, 0, 0, 0.05)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={(e) => {
        if (kpi.link) {
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }
      }}
      onMouseLeave={(e) => {
        if (kpi.link) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1 truncate">{kpi.label}</p>
          {kpi.value && (
            <p className="text-3xl font-bold text-gray-800 truncate">{kpi.value}</p>
          )}
        </div>
        <div 
          className="p-2.5"
          style={{
            backgroundColor: kpi.iconBgColor || '#F3F4F6',
            borderRadius: '8px'
          }}
        >
          <MainIcon className={`w-6 h-6 ${kpi.iconColor || 'text-gray-600'}`} strokeWidth={2} />
        </div>
      </div>
      
      {kpi.actionText && (
         <p className={`mt-2 text-sm ${kpi.iconColor || 'text-gray-700'}`}>{kpi.actionText}</p>
      )}

      {kpi.trendText && (
        <div className={`mt-4 flex items-center ${kpi.actionText ? 'pt-2 border-t border-gray-100' : '' }`}>
          {TrendIcon && (
            <TrendIcon className={`w-4 h-4 mr-1 ${kpi.trendColorClass || 'text-gray-500'}`} strokeWidth={2.5} />
          )}
          <p className={`text-xs ${kpi.trendColorClass || 'text-gray-500'}`}>{kpi.trendText}</p>
        </div>
      )}
    </div>
  );

  if (kpi.link) {
    return (
      <Link 
        to={kpi.link} 
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60 h-full"
        style={{ borderRadius: '8px' }}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="h-full">
      {cardContent}
    </div>
  );
};

export default KpiCard; 