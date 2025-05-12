import { LayoutDashboard, Settings, Database, BarChart2, ShoppingCart, Compass, LineChart, LogOut, Target, Wallet, ChevronDown, ChevronRight, FolderKanban } from 'lucide-react'; // Add FolderKanban icon
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface DropdownProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const DropdownSection = ({ title, icon, isActive, isOpen, onClick, children }: DropdownProps) => {
  return (
    <div>
      <button
        onClick={onClick}
        className={`flex items-center justify-between w-full p-2 rounded ${
          isActive ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-200'
        }`}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      <div className={`pl-8 space-y-2 overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 mt-2' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    analytics: false,
    tracker: false,
    data: false
  });

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getLinkClasses = (path: string) => {
    return `flex items-center space-x-2 p-2 rounded ${
      isActive(path)
        ? 'bg-gray-200 text-gray-900'
        : 'hover:bg-gray-200'
    }`;
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="w-64 bg-gray-100 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Logo</h1>
      </div>
      
      <nav className="space-y-2">
        <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link to="/marketplace" className={getLinkClasses('/marketplace')}>
          <ShoppingCart size={20} />
          <span>Marketplace</span>
        </Link>

        <DropdownSection
          title="Analytics"
          icon={<BarChart2 size={20} />}
          isActive={isActive('/analytics')}
          isOpen={openSections.analytics}
          onClick={() => toggleSection('analytics')}
        >
          <Link to="/analytics/explorer" className={getLinkClasses('/analytics/explorer')}>
            <LineChart size={20} />
            <span>Explorer</span>
          </Link>
        </DropdownSection>

        <DropdownSection
          title="Tracker"
          icon={<Target size={20} />}
          isActive={isActive('/tracker')}
          isOpen={openSections.tracker}
          onClick={() => toggleSection('tracker')}
        >
          <Link to="/tracker/crop-progress" className={getLinkClasses('/tracker/crop-progress')}>
            <LineChart size={20} />
            <span>Crop Progress</span>
          </Link>
          <Link to="/tracker/budgets" className={getLinkClasses('/tracker/budgets')}>
            <Wallet size={20} />
            <span>Budgets</span>
          </Link>
        </DropdownSection>

        <DropdownSection
          title="Data"
          icon={<Database size={20} />}
          isActive={isActive('/data')}
          isOpen={openSections.data}
          onClick={() => toggleSection('data')}
        >
          <Link to="/data/operations" className={getLinkClasses('/data/operations')}>
            <Compass size={20} />
            <span>Operations</span>
          </Link>
          <Link to="/data/field-groups" className={getLinkClasses('/data/field-groups')}>
            <FolderKanban size={20} /> {/* Use new icon */}
            <span>Field Groups</span>
          </Link>
        </DropdownSection>

        <Link to="/settings" className={getLinkClasses('/settings')}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>

        <Link to="/logout" className={`flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-gray-600`}>
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </nav>
    </div>
  );
}