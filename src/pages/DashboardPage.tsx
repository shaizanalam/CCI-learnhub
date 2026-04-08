import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Bot, Bell, ChevronRight } from 'lucide-react';

const stats = [
  { label: 'Your Role', value: '', color: 'text-cci-accent' },
  { label: 'Account Status', value: 'Approved', color: 'text-cci-green' },
];

const features = [
  { title: 'My Subjects', desc: 'Browse subjects and access chapter-wise notes, videos & practice sheets.', icon: '📚', color: 'purple', path: '/subjects' },
  { title: 'AI Doubt Solver', desc: 'Get instant answers to your doubts — powered by AI, available 24/7.', icon: '🤖', color: 'green', path: '/chat' },
  { title: 'Notifications', desc: 'Class schedules, test alerts, new material uploads and announcements.', icon: '🔔', color: 'cyan', path: '/notifications' },
];

const colorMap: Record<string, string> = {
  purple: 'before:bg-[radial-gradient(circle_at_top_right,hsl(var(--cci-accent)/0.15),transparent_60%)]',
  green: 'before:bg-[radial-gradient(circle_at_top_right,hsl(var(--cci-green)/0.1),transparent_60%)]',
  amber: 'before:bg-[radial-gradient(circle_at_top_right,hsl(var(--cci-amber)/0.1),transparent_60%)]',
  cyan: 'before:bg-[radial-gradient(circle_at_top_right,hsl(var(--cci-cyan)/0.1),transparent_60%)]',
};

const iconBgMap: Record<string, string> = {
  purple: 'bg-cci-accent/15',
  green: 'bg-cci-green/[.12]',
  amber: 'bg-cci-amber/[.12]',
  cyan: 'bg-cci-cyan/[.12]',
};

export default function DashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-cci-accent/20 to-cci-accent3/[.12] border border-cci-accent/20 rounded-2xl p-7 mb-6 relative overflow-hidden">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-7xl opacity-[.12] pointer-events-none">🎓</div>
        <h1 className="font-syne text-2xl font-extrabold mb-1.5">
          Welcome back, {profile?.name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="text-muted-foreground text-sm">Access your study materials and AI doubt solver.</p>
      </div>

      {/* Quick Access */}
      <h3 className="font-syne text-base font-bold mb-3.5">Quick Access</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {features.map(f => (
          <div
            key={f.title}
            onClick={() => navigate(f.path)}
            className={`bg-card border border-border rounded-2xl p-7 cursor-pointer transition-all duration-200 flex flex-col gap-4 relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,.5)] hover:border-input group before:content-[''] before:absolute before:inset-0 before:opacity-0 before:transition-opacity hover:before:opacity-100 before:pointer-events-none ${colorMap[f.color]}`}
          >
            <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl flex-shrink-0 ${iconBgMap[f.color]}`}>
              {f.icon}
            </div>
            <div>
              <div className="font-syne text-[17px] font-bold">{f.title}</div>
              <div className="text-[13px] text-muted-foreground leading-relaxed mt-1">{f.desc}</div>
            </div>
            <div className="w-8 h-8 rounded-full border border-input flex items-center justify-center text-muted-foreground self-end mt-auto group-hover:bg-cci-accent group-hover:border-cci-accent group-hover:text-primary-foreground transition-all">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
