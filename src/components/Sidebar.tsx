import { LayoutDashboard, Settings, Database, BarChart2, ShoppingCart, Compass, LineChart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Logo</h1>
      </div>
      
      <nav className="space-y-2">
        <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/marketplace" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
          <ShoppingCart size={20} />
          <span>Marketplace</span>
        </Link>
        <div>
          <Link to="/analytics" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
            <BarChart2 size={20} />
            <span>Analytics</span>
          </Link>
          <div className="pl-8 space-y-2">
            <Link to="/analytics/explorer" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
              <LineChart size={20} />
              <span>Explorer</span>
            </Link>
          </div>
        </div>
        <div>
          <Link to="/data" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
            <Database size={20} />
            <span>Data</span>
          </Link>
          <div className="pl-8">
            <Link to="/data/operations" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
              <Compass size={20} />
              <span>Operations</span>
            </Link>
          </div>
        </div>
        <Link to="/settings" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <Link to="/logout" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-gray-600">
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </nav>
    </div>
  );
}