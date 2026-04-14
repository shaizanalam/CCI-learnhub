import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, Bell, LayoutDashboard } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'Study', path: '/subjects', icon: BookOpen },
  { label: 'Doubts', path: '/chat', icon: MessageCircle },
  { label: 'Alerts', path: '/notifications', icon: Bell },
  { label: 'Admin', path: '/admin', icon: LayoutDashboard },
];

export default function SimpleBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-500 border-t-4 border-black p-4 z-[9999] md:hidden">
      <p className="text-white text-center mb-2 font-bold">SIMPLE NAVIGATION TEST</p>
      <div className="flex gap-2 justify-center">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => {
              alert(`Going to: ${item.path}`);
              navigate(item.path);
            }}
            className="bg-white text-red-500 px-3 py-2 rounded text-xs font-bold"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
