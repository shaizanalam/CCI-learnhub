import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FileText, ExternalLink, ChevronLeft, Loader2 } from 'lucide-react';

interface Material {
  id: string;
  title: string | null;
  file_url: string | null;
  subject_id: string | null;
}

interface Subject {
  id: string;
  name: string | null;
  class: string | null;
}

export default function MaterialsPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!subjectId) return;
      console.log('Loading materials for subject:', subjectId);
      setLoading(true);
      let timeoutId: NodeJS.Timeout;
      try {
        timeoutId = setTimeout(() => {
          console.log('Materials fetch timeout');
          setLoading(false);
        }, 5000);

        const [subjRes, matsRes] = await Promise.all([
          supabase.from('subjects').select('*').eq('id', subjectId).single(),
          supabase.from('materials').select('*').eq('subject_id', subjectId),
        ]);

        if (subjRes.error) {
          console.error('Error fetching subject:', subjRes.error);
          setSubject(null);
        } else {
          console.log('Subject fetched:', subjRes.data);
          setSubject(subjRes.data);
        }

        if (matsRes.error) {
          console.error('Error fetching materials:', matsRes.error);
          setMaterials([]);
        } else {
          console.log('Materials fetched:', matsRes.data);
          setMaterials(matsRes.data || []);
        }
      } catch (error) {
        console.error('Exception loading data:', error);
        setSubject(null);
        setMaterials([]);
      } finally {
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    loadData();
  }, [subjectId]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cci-accent" /></div>;
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-[13px] text-muted-foreground">
        <button onClick={() => navigate('/subjects')} className="hover:text-foreground transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" /> Subjects
        </button>
        <span className="text-cci-text3">/</span>
        <span className="text-foreground">{subject?.name || 'Subject'}</span>
      </div>

      <div className="mb-7">
        <h1 className="font-syne text-[26px] font-extrabold tracking-tight mb-1">{subject?.name || 'Materials'}</h1>
        <p className="text-muted-foreground text-sm">Study materials for this subject</p>
      </div>

      {materials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <div className="text-5xl mb-4 opacity-50">📄</div>
          <h3 className="font-syne text-lg font-bold text-foreground mb-2">No Materials Yet</h3>
          <p className="text-sm max-w-[280px]">Materials haven't been uploaded for this subject yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 stagger">
          {materials.map(m => (
            <div key={m.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-3.5 hover:border-input transition-all animate-slide-up">
              <div className="w-10 h-10 bg-cci-accent/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-cci-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[15px] truncate">{m.title || 'Untitled'}</div>
              </div>
              {m.file_url && (
                <a
                  href={m.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-cci-bg3 text-sm font-medium hover:border-cci-accent hover:text-cci-accent transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> Open
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
