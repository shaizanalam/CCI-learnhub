import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { Menu, Bell, LogOut, LayoutDashboard, BookOpen, Bot, ClipboardCheck } from 'lucide-react';
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
  { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Subjects', path: '/subjects', icon: BookOpen },
  { label: 'AI Chat', path: '/chat', icon: Bot },
  { label: 'Alerts', path: '/notifications', icon: Bell },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const title = Object.entries(pageTitles).find(([path]) => location.pathname.startsWith(path))?.[1] || 'CCI';

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:ml-60 min-h-screen">
        {/* Topbar */}
        <header className="h-[60px] bg-card border-b border-border flex items-center px-4 md:px-7 gap-4 sticky top-0 z-50">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden flex items-center justify-center w-9 h-9 text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-syne font-bold text-[17px] flex-1">{title}</h2>
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate('/notifications')} className="w-9 h-9 bg-cci-bg3 border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:bg-cci-bg4 hover:text-foreground transition-all">
              <Bell className="w-4 h-4" />
            </button>
            <button onClick={signOut} className="w-9 h-9 bg-cci-bg3 border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:bg-cci-bg4 hover:text-foreground transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-7 pb-24 md:pb-7 overflow-y-auto">
          <Outlet />
        </main>

        {/* Bottom nav (mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50 pb-[env(safe-area-inset-bottom)]">
          {bottomNavItems.map(item => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-semibold tracking-wide transition-colors ${
                  active ? 'text-cci-accent' : 'text-cci-text3'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
