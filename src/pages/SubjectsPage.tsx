import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Subject {
  id: string;
  name: string | null;
  class: string | null;
}

const subjectEmojis: Record<string, string> = {
  physics: '⚛️', chemistry: '🧪', mathematics: '📐', math: '📐', biology: '🧬', english: '📖', hindi: '📝',
};

const subjectColors: Record<string, { border: string; tag: string }> = {
  physics: { border: 'border-t-cci-accent', tag: 'bg-cci-accent/15 text-cci-accent' },
  chemistry: { border: 'border-t-cci-green', tag: 'bg-cci-green/[.12] text-cci-green' },
  mathematics: { border: 'border-t-cci-amber', tag: 'bg-cci-amber/[.12] text-cci-amber' },
  math: { border: 'border-t-cci-amber', tag: 'bg-cci-amber/[.12] text-cci-amber' },
  biology: { border: 'border-t-cci-rose', tag: 'bg-cci-rose/[.12] text-cci-rose' },
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      console.log('Fetching subjects');
      setLoading(true);
      let timeoutId: NodeJS.Timeout;
      try {
        timeoutId = setTimeout(() => {
          console.log('Subjects fetch timeout');
          setLoading(false);
        }, 5000);

        const { data, error } = await supabase.from('subjects').select('*');
        if (error) {
          console.error('Error fetching subjects:', error);
          setSubjects([]);
          return;
        }
        console.log('Subjects fetched:', data);
        setSubjects(data || []);
      } catch (error) {
        console.error('Exception fetching subjects:', error);
        setSubjects([]);
      } finally {
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-cci-accent" />
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <div className="text-5xl mb-4 opacity-50">📚</div>
        <h3 className="font-syne text-lg font-bold text-foreground mb-2">No Subjects Found</h3>
        <p className="text-sm max-w-[280px]">Subjects haven't been added yet. Please contact your admin.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="font-syne text-[26px] font-extrabold tracking-tight mb-1">My Subjects 📚</h1>
        <p className="text-muted-foreground text-sm">Select a subject to view study materials.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
        {subjects.map(s => {
          const key = (s.name || '').toLowerCase();
          const emoji = subjectEmojis[key] || '📚';
          const colors = subjectColors[key] || { border: 'border-t-cci-accent', tag: 'bg-cci-accent/15 text-cci-accent' };
          return (
            <div
              key={s.id}
              onClick={() => navigate(`/subjects/${s.id}`)}
              className={`bg-card border border-border border-t-[3px] ${colors.border} rounded-2xl p-8 cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3.5 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,.5)] hover:border-input animate-slide-up`}
            >
              <div className="text-[42px] leading-none">{emoji}</div>
              <div className="font-syne text-lg font-extrabold tracking-tight">{s.name}</div>
              <span className={`text-[11px] font-semibold tracking-[0.5px] uppercase px-2.5 py-1 rounded-full ${colors.tag}`}>
                {s.class || 'General'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
