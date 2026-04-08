import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Bot, Bell, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap } from 'lucide-react';

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

      <aside className={`fixed top-0 left-0 bottom-0 w-60 bg-card border-r border-border flex flex-col z-[200] transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="p-5 pb-4 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cci-accent to-cci-accent3 rounded-[10px] flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="font-syne font-extrabold text-[15px] leading-tight tracking-tight">
            CCI
            <span className="block text-[10px] font-medium text-muted-foreground tracking-[0.5px] uppercase">Learning Platform</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto flex flex-col gap-1">
          <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-cci-text3 px-2 py-3 pb-1.5">Main</div>
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative w-full text-left ${
                isActive(item.path)
                  ? 'bg-cci-accent/15 text-cci-accent'
                  : 'text-muted-foreground hover:bg-cci-bg3 hover:text-foreground'
              }`}
            >
              {isActive(item.path) && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-[3px] h-[22px] bg-cci-accent rounded-r" />
              )}
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-cci-rose text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}

          {isAdmin && (
            <>
              <div className="h-px bg-border my-2" />
              <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-cci-text3 px-2 py-3 pb-1.5">Admin</div>
              {adminItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative w-full text-left ${
                    isActive(item.path)
                      ? 'bg-cci-accent/15 text-cci-accent'
                      : 'text-muted-foreground hover:bg-cci-bg3 hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {item.label}
                </button>
              ))}
            </>
          )}
        </nav>

        {/* User */}
        <div className="mx-3 mb-3">
          <div
            onClick={signOut}
            className="flex items-center gap-2.5 p-3 bg-cci-bg3 rounded-lg cursor-pointer hover:bg-cci-bg4 transition-colors"
          >
            <div className="w-[34px] h-[34px] bg-gradient-to-br from-cci-accent to-cci-cyan rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 text-primary-foreground">
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">{profile?.name || 'User'}</div>
              <div className="text-[11px] text-muted-foreground">{profile?.role || 'student'}</div>
            </div>
            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
      </aside>
    </>
  );
}
