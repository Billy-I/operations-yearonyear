import { Menu, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function MobileHeader({ onMenuClick, title = "Yagro" }: MobileHeaderProps) {
  return (
    <header className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors duration-200 touch-manipulation"
        aria-label="Open secondary navigation"
        type="button"
      >
        <Menu size={24} className="text-gray-700" />
      </button>
      
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      
      {/* Quick access to settings */}
      <Link
        to="/settings"
        className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors duration-200 touch-manipulation"
        aria-label="Settings"
      >
        <Settings size={20} className="text-gray-500" />
      </Link>
    </header>
  );
}
