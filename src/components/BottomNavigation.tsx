import { LayoutDashboard, ShoppingCart, Brain, BarChart2, Target, LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    id: 'marketplace',
    label: 'Market',
    icon: ShoppingCart,
    path: '/marketplace'
  },
  {
    id: 'ai-forecaster',
    label: 'AI Forecast',
    icon: Brain,
    path: '/ai-forecaster'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart2,
    path: '/analytics/explorer'
  },
  {
    id: 'tracker',
    label: 'Tracker',
    icon: Target,
    path: '/tracker/crop-progress'
  }
];

export default function BottomNavigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    // Handle exact matches and parent paths
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path === '/marketplace') {
      return location.pathname === '/marketplace';
    }
    if (path === '/ai-forecaster') {
      return location.pathname.startsWith('/ai-forecaster');
    }
    if (path === '/analytics/explorer') {
      return location.pathname.startsWith('/analytics');
    }
    if (path === '/tracker/crop-progress') {
      return location.pathname.startsWith('/tracker');
    }
    return false;
  };

  return (
    <>
      {/* Safe area spacer for devices with home indicator */}
      <div className="h-safe-area-inset-bottom md:hidden" />
      
      {/* Bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
        {/* iOS-style blur background effect */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
        
        {/* Navigation items */}
        <div className="relative px-2 py-1">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-lg transition-all duration-200 ease-out touch-manipulation ${
                    active
                      ? 'text-yagro-brand transform scale-105'
                      : 'text-gray-500 hover:text-gray-700 active:scale-95'
                  }`}
                  style={{
                    // Ensure minimum touch target of 44x44px (iOS HIG)
                    minHeight: '44px',
                    minWidth: '44px'
                  }}
                >
                  {/* Icon container with active state animation */}
                  <div className={`relative transition-transform duration-200 ${
                    active ? 'scale-110' : ''
                  }`}>
                    <Icon 
                      size={22} 
                      className={`transition-all duration-200 ${
                        active 
                          ? 'text-yagro-brand drop-shadow-sm' 
                          : 'text-gray-500'
                      }`}
                    />
                    
                    {/* Badge for notifications */}
                    {item.badge && item.badge > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium leading-none">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Label with iOS-style typography */}
                  <span className={`text-xs font-medium mt-1 leading-tight transition-all duration-200 ${
                    active 
                      ? 'text-yagro-brand' 
                      : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator dot */}
                  <div className={`w-1 h-1 rounded-full mt-1 transition-all duration-200 ${
                    active 
                      ? 'bg-yagro-brand opacity-100 scale-100' 
                      : 'bg-transparent opacity-0 scale-0'
                  }`} />
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* iOS-style home indicator spacer */}
        <div className="h-safe-area-inset-bottom" />
      </nav>
    </>
  );
}
