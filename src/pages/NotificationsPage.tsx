const notifications = [
  { id: 1, icon: '🚨', title: 'Welcome to CCI Learning Platform', msg: 'Your account has been verified. You now have full access to all study materials and AI doubt solving. All the best!', date: 'Today', unread: true, bg: 'bg-cci-rose/[.12]' },
  { id: 2, icon: '📚', title: 'New Study Materials Available', msg: 'Check the Subjects section for newly uploaded study materials from your teachers.', date: 'Today', unread: true, bg: 'bg-cci-accent/15' },
  { id: 3, icon: '🤖', title: 'AI Doubt Solver is Online', msg: 'You can now ask any subject-related doubts to the AI tutor 24/7. Try it out!', date: 'Today', unread: false, bg: 'bg-cci-green/10' },
];

export default function NotificationsPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="font-syne text-[26px] font-extrabold tracking-tight mb-1">Notifications 🔔</h1>
        <p className="text-muted-foreground text-sm">Stay updated with the latest announcements.</p>
      </div>
      <div className="flex flex-col gap-2.5 stagger">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`bg-card border border-border rounded-2xl p-5 flex gap-4 transition-all hover:border-input animate-slide-up ${n.unread ? 'border-l-[3px] border-l-cci-accent' : ''}`}
          >
            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0 ${n.bg}`}>{n.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-[15px] mb-1">{n.title}</div>
              <div className="text-[13px] text-muted-foreground leading-relaxed mb-2">{n.msg}</div>
              <div className="text-[11px] text-cci-text3">{n.date}</div>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full bg-cci-accent flex-shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}
