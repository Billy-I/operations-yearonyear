import { LayoutDashboard, Settings, Database, BarChart2, ShoppingCart, Compass, LineChart, LogOut, Target, Wallet, ChevronRight, FolderKanban, Brain, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface DropdownProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
  isMobile?: boolean;
}

const DropdownSection = ({ title, icon, isActive, isOpen, onClick, children, isMobile = false }: DropdownProps) => {
  return (
    <div>
      <button
        onClick={onClick}
        className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
            : 'hover:bg-gray-50 active:bg-gray-100'
        } ${isMobile ? 'text-base min-h-[52px]' : 'text-sm'}`}
      >
        <div className="flex items-center space-x-3">
          <div className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            {icon}
          </div>
          <span className="font-medium">{title}</span>
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
          <ChevronRight size={isMobile ? 18 : 16} />
        </div>
      </button>
      <div className={`pl-6 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 mt-2 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {children}
      </div>
    </div>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    analytics: false,
    tracker: false,
    data: false
  });
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change for mobile (only when clicking links)
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, onClose]);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 font-medium ${
      isMobile ? 'text-base min-h-[52px]' : 'text-sm'
    }`;
    
    if (isActive(path)) {
      return `${baseClasses} bg-blue-50 text-blue-700 border-l-4 border-blue-500`;
    }
    
    return `${baseClasses} hover:bg-gray-50 active:bg-gray-100 text-gray-700`;
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sidebarContent = (
    <>
      {/* Header with close button for mobile */}
      <div className="flex-none mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Yagro</h1>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Close navigation"
            >
              <X size={24} className="text-gray-500" />
            </button>
          )}
        </div>
        {isMobile && (
          <p className="text-sm text-gray-500 mt-2">Secondary navigation & settings</p>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {/* Desktop: Full navigation, Mobile: Secondary items only */}
        {!isMobile && (
          <>
            <Link to="/dashboard" className={getLinkClasses('/dashboard')} onClick={handleLinkClick}>
              <LayoutDashboard size={20} className={isActive('/dashboard') ? 'text-blue-600' : 'text-gray-500'} />
              <span>Dashboard</span>
            </Link>

            <Link to="/marketplace" className={getLinkClasses('/marketplace')} onClick={handleLinkClick}>
              <ShoppingCart size={20} className={isActive('/marketplace') ? 'text-blue-600' : 'text-gray-500'} />
              <span>Marketplace</span>
            </Link>

            <Link to="/ai-forecaster" className={getLinkClasses('/ai-forecaster')} onClick={handleLinkClick}>
              <Brain size={20} className={isActive('/ai-forecaster') ? 'text-blue-600' : 'text-gray-500'} />
              <span>AI Yield Forecaster</span>
            </Link>
          </>
        )}

        <DropdownSection
          title="Analytics"
          icon={<BarChart2 size={20} />}
          isActive={isActive('/analytics')}
          isOpen={openSections.analytics}
          onClick={() => toggleSection('analytics')}
          isMobile={isMobile}
        >
          <Link to="/analytics/explorer" className={getLinkClasses('/analytics/explorer')} onClick={handleLinkClick}>
            <LineChart size={18} className={isActive('/analytics/explorer') ? 'text-blue-600' : 'text-gray-400'} />
            <span>Explorer</span>
          </Link>
          <Link to="/analytics/multi-year" className={getLinkClasses('/analytics/multi-year')} onClick={handleLinkClick}>
            <BarChart2 size={18} className={isActive('/analytics/multi-year') ? 'text-blue-600' : 'text-gray-400'} />
            <span>Multi-Year Analysis</span>
          </Link>
        </DropdownSection>

        <DropdownSection
          title="Tracker"
          icon={<Target size={20} />}
          isActive={isActive('/tracker')}
          isOpen={openSections.tracker}
          onClick={() => toggleSection('tracker')}
          isMobile={isMobile}
        >
          <Link to="/tracker/crop-progress" className={getLinkClasses('/tracker/crop-progress')} onClick={handleLinkClick}>
            <LineChart size={18} className={isActive('/tracker/crop-progress') ? 'text-blue-600' : 'text-gray-400'} />
            <span>Crop Progress</span>
          </Link>
          <Link to="/tracker/budgets" className={getLinkClasses('/tracker/budgets')} onClick={handleLinkClick}>
            <Wallet size={18} className={isActive('/tracker/budgets') ? 'text-blue-600' : 'text-gray-400'} />
            <span>Budgets</span>
          </Link>
        </DropdownSection>

        <DropdownSection
          title="Data Management"
          icon={<Database size={20} />}
          isActive={isActive('/data')}
          isOpen={openSections.data}
          onClick={() => toggleSection('data')}
          isMobile={isMobile}
        >
          <Link to="/data/operations" className={getLinkClasses('/data/operations')} onClick={handleLinkClick}>
            <Compass size={18} className={isActive('/data/operations') ? 'text-blue-600' : 'text-gray-400'} />
            <span>Operations Center</span>
          </Link>
          <Link to="/data/field-groups" className={getLinkClasses('/data/field-groups')} onClick={handleLinkClick}>
            <FolderKanban size={18} className={isActive('/data/field-groups') ? 'text-blue-600' : 'text-gray-400'} />
            <span>Field Groups</span>
          </Link>
        </DropdownSection>

        {/* Development & Admin items */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
            {isMobile ? 'Admin' : 'Development'}
          </p>
          
          <Link to="/dashboard-preview-xyz" className={getLinkClasses('/dashboard-preview-xyz')} onClick={handleLinkClick}>
            <LayoutDashboard size={20} className={isActive('/dashboard-preview-xyz') ? 'text-blue-600' : 'text-gray-500'} />
            <span>Hidden Dashboard</span>
          </Link>

          <Link to="/settings" className={getLinkClasses('/settings')} onClick={handleLinkClick}>
            <Settings size={20} className={isActive('/settings') ? 'text-blue-600' : 'text-gray-500'} />
            <span>Settings</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="flex-none pt-4 border-t border-gray-200">
        <Link 
          to="/logout" 
          className="flex items-center space-x-3 p-3 hover:bg-red-50 rounded-xl text-red-600 transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: Overlay sidebar */}
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        
        {/* Mobile sidebar */}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full p-4 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      </>

      {/* Desktop: Persistent sidebar */}
      <div className="hidden md:flex w-64 bg-white h-screen border-r border-gray-200 flex-col">
        <div className="h-full p-4 flex flex-col">
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
