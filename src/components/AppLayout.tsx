import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import Logo from './Logo';
import { Menu, Bell, LogOut, LayoutDashboard, BookOpen, Bot, ClipboardCheck, Home, Coffee, FileText, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/subjects': 'My Subjects',
  '/chat': 'AI Doubt Solver',
  '/notifications': 'Notifications',
  '/admin': 'Admin Panel',
};

const bottomNavItems = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'Study', path: '/subjects', icon: BookOpen },
  { label: 'Doubts', path: '/chat', icon: MessageCircle },
  { label: 'Alerts', path: '/notifications', icon: Bell },
  { label: 'Admin', path: '/admin', icon: LayoutDashboard },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const title = Object.entries(pageTitles).find(([path]) => location.pathname.startsWith(path))?.[1] || 'CCI';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:ml-60 min-h-screen">
        {/* Topbar */}
        <header className="h-[72px] bg-white/80 backdrop-blur-lg border-b border-white/20 flex items-center px-4 md:px-7 gap-4 sticky top-0 z-50 shadow-lg">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden flex items-center justify-center w-10 h-10 bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl text-gray-700 hover:bg-white/90 transition-all">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
              <Logo size="sm" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-500"> 10th Classroom</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-white/90 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={signOut} className="w-10 h-10 bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-white/90 transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-7 pb-24 md:pb-7 overflow-y-auto relative z-10">
          <Outlet />
        </main>

        {/* Bottom nav (mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-xl z-50 pb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-around py-2">
            {bottomNavItems.map(item => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 ${
                    active 
                      ? 'text-purple-600 bg-purple-100 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
