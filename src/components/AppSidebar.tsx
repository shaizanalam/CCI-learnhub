import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Bot, Bell, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from './Logo';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Subjects', path: '/subjects', icon: BookOpen },
  { label: 'AI Doubt Solver', path: '/chat', icon: Bot },
  { label: 'Notifications', path: '/notifications', icon: Bell, badge: 3 },
];

const adminItems = [
  { label: 'Admin Panel', path: '/admin', icon: Settings },
];

export default function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] md:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 w-60 sm:w-60 bg-[#9ED3DC]/90 backdrop-blur-lg border border-white/20 flex flex-col z-[250] transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="p-3 sm:p-5 pb-2.5 sm:pb-4 border-b border-border flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-[8px] sm:rounded-[10px] flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200">
            <Logo size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-syne text-[12px] sm:text-[15px] font-extrabold leading-tight tracking-tight">
              CCI
              <span className="block text-[8px] sm:text-[10px] font-medium text-muted-foreground tracking-[0.5px] uppercase">Learning Platform</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 sm:p-3 overflow-y-auto flex flex-col gap-0.5 sm:gap-1">
          <div className="text-[8px] sm:text-[10px] font-semibold tracking-[1.5px] uppercase text-cci-text3 px-2 py-2 sm:py-3 pb-1 sm:pb-1.5">Main</div>
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all relative w-full text-left ${
                isActive(item.path)
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {isActive(item.path) && (
                <div className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 w-[2px] sm:w-[3px] h-[18px] sm:h-[22px] bg-purple-500 rounded-r" />
              )}
              <item.icon className="w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] flex-shrink-0" />
              <span className="hidden sm:block">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}

          {isAdmin && (
            <>
              <div className="h-px bg-border my-2" />
              <div className="text-[8px] sm:text-[10px] font-semibold tracking-[1.5px] uppercase text-cci-text3 px-2 py-2 sm:py-3 pb-1 sm:pb-1.5">Admin</div>
              {adminItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all relative w-full text-left ${
                    isActive(item.path)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {isActive(item.path) && (
                    <div className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 w-[2px] sm:w-[3px] h-[18px] sm:h-[22px] bg-purple-500 rounded-r" />
                  )}
                  <item.icon className="w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] flex-shrink-0" />
                  <span className="hidden sm:block">{item.label}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* User */}
        <div className="mx-2 sm:mx-3 mb-2 sm:mb-3">
          <div
            onClick={signOut}
            className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-3 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <div className="w-[28px] h-[28px] sm:w-[34px] sm:h-[34px] bg-gradient-to-br from-cci-accent to-cci-cyan flex items-center justify-center font-bold text-[11px] sm:text-sm flex-shrink-0 text-primary-foreground">
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs sm:text-sm truncate">{profile?.name || 'User'}</div>
              <div className="text-[10px] sm:text-xs text-gray-600">{profile?.role || 'student'}</div>
            </div>
            <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
          </div>
        </div>
      </aside>
    </>
  );
}
