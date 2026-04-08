import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  approved: boolean | null;
}

export default function AdminPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleApproval = async (user: UserRow) => {
    const newVal = !user.approved;
    const { error } = await supabase.from('users').update({ approved: newVal }).eq('id', user.id);
    if (error) {
      toast.error('Failed to update: ' + error.message);
    } else {
      toast.success(`${user.name} ${newVal ? 'approved' : 'rejected'}`);
      fetchUsers();
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground animate-fade-in">
        <div className="text-5xl mb-4 opacity-50">🔒</div>
        <h3 className="font-syne text-lg font-bold text-foreground mb-2">Access Denied</h3>
        <p className="text-sm">Only admins can access this page.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cci-accent" /></div>;
  }

  const pending = users.filter(u => !u.approved);
  const approved = users.filter(u => u.approved);

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="font-syne text-[26px] font-extrabold tracking-tight mb-1">Admin Panel ⚙️</h1>
        <p className="text-muted-foreground text-sm">Manage students and approve access.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs text-muted-foreground font-medium mb-2">Total Students</div>
          <div className="font-syne text-[28px] font-extrabold tracking-tight text-cci-accent">{users.length}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs text-muted-foreground font-medium mb-2">Pending Approvals</div>
          <div className="font-syne text-[28px] font-extrabold tracking-tight text-cci-amber">{pending.length}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs text-muted-foreground font-medium mb-2">Approved</div>
          <div className="font-syne text-[28px] font-extrabold tracking-tight text-cci-green">{approved.length}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs text-muted-foreground font-medium mb-2">Admin</div>
          <div className="font-syne text-[28px] font-extrabold tracking-tight text-cci-cyan">{users.filter(u => u.role === 'admin').length}</div>
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h3 className="font-syne text-[17px] font-bold mb-4 pb-3.5 border-b border-border flex items-center gap-2.5">
            ⏳ Pending Approvals
          </h3>
          {pending.map(u => (
            <UserRow key={u.id} user={u} onToggle={toggleApproval} />
          ))}
        </div>
      )}

      {/* All Users */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-syne text-[17px] font-bold mb-4 pb-3.5 border-b border-border flex items-center gap-2.5">
          👥 All Users
        </h3>
        {users.map(u => (
          <UserRow key={u.id} user={u} onToggle={toggleApproval} />
        ))}
      </div>
    </div>
  );
}

function UserRow({ user, onToggle }: { user: UserRow; onToggle: (u: UserRow) => void }) {
  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-border last:border-b-0">
      <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-cci-accent to-cci-cyan flex items-center justify-center font-bold text-sm flex-shrink-0 text-primary-foreground">
        {user.name?.[0]?.toUpperCase() || 'U'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{user.name || 'Unknown'}</div>
        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
      </div>
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${user.approved ? 'bg-cci-green/10 text-cci-green' : 'bg-cci-amber/[.12] text-cci-amber'}`}>
        {user.approved ? 'Approved' : 'Pending'}
      </span>
      <button
        onClick={() => onToggle(user)}
        className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
          user.approved
            ? 'border-border text-muted-foreground hover:border-cci-rose hover:text-cci-rose'
            : 'border-cci-green text-cci-green bg-cci-green/10 hover:bg-cci-green hover:text-background'
        }`}
      >
        {user.approved ? 'Revoke' : '✓ Approve'}
      </button>
    </div>
  );
}
