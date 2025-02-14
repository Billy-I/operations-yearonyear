import { LayoutDashboard, Settings, Database, BarChart2, ShoppingCart, Compass, LineChart, LogOut, Target, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path: string) => {
    return `flex items-center space-x-2 p-2 rounded ${
      isActive(path)
        ? 'bg-blue-100 text-blue-600'
        : 'hover:bg-gray-200'
    }`;
  };

  return (
    <div className="w-64 bg-gray-100 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Logo</h1>
      </div>
      
      <nav className="space-y-2">
        <Link to="/" className={getLinkClasses('/')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/marketplace" className={getLinkClasses('/marketplace')}>
          <ShoppingCart size={20} />
          <span>Marketplace</span>
        </Link>
        <div>
          <Link to="/analytics" className={getLinkClasses('/analytics')}>
            <BarChart2 size={20} />
            <span>Analytics</span>
          </Link>
          <div className="pl-8 space-y-2">
            <Link to="/analytics/explorer" className={getLinkClasses('/analytics/explorer')}>
              <LineChart size={20} />
              <span>Explorer</span>
            </Link>
          </div>
        </div>
        <div>
          <Link to="/tracker" className={getLinkClasses('/tracker')}>
            <Target size={20} />
            <span>Tracker</span>
          </Link>
          <div className="pl-8 space-y-2">
            <Link to="/tracker/budgets" className={getLinkClasses('/tracker/budgets')}>
              <Wallet size={20} />
              <span>Budgets</span>
            </Link>
            <Link to="/tracker/budgets-alt" className={getLinkClasses('/tracker/budgets-alt')}>
              <Wallet size={20} />
              <span>Budgets (Alt)</span>
            </Link>
            <Link to="/tracker/budgets-simple" className={getLinkClasses('/tracker/budgets-simple')}>
              <Wallet size={20} />
              <span>Budgets Simple</span>
            </Link>
          </div>
        </div>
        <div>
          <Link to="/data" className={getLinkClasses('/data')}>
            <Database size={20} />
            <span>Data</span>
          </Link>
          <div className="pl-8 space-y-2">
            <Link to="/data/operations" className={getLinkClasses('/data/operations')}>
              <Compass size={20} />
              <span>Operations</span>
            </Link>
          </div>
        </div>
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