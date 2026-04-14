import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FileText, ExternalLink, ChevronLeft, Loader2, Search, Download, Eye, Calendar, BookOpen } from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-lg">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
          <p className="text-gray-600 mt-4">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => navigate('/subjects')} 
          className="flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl text-sm font-medium text-gray-700 hover:bg-white/90 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Subjects
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">{subject?.name || 'Subject'}</span>
      </div>

      {/* Subject Header */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 mb-8 shadow-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{subject?.name || 'Materials'}</h1>
            <p className="text-gray-700 mb-4">Study materials and resources for this subject</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">{materials.length} Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">{subject?.class || 'General'}</span>
              </div>
            </div>
          </div>
          <div className="w-20 h-20 bg-white/50 rounded-3xl flex items-center justify-center">
            <FileText className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-12 shadow-lg text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Materials Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">Materials haven't been uploaded for this subject yet. Check back later or contact your teacher.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {materials.map(m => (
            <div key={m.id} className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 animate-slide-up">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{m.title || 'Untitled Material'}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Recently added
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View online
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.file_url && (
                    <>
                      <button className="p-3 bg-gray-100 rounded-2xl text-gray-600 hover:bg-gray-200 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <a
                        href={m.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium text-sm hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {materials.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{materials.length}</p>
                <p className="text-sm text-gray-600">Total Files</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{materials.filter(m => m.file_url).length}</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">Subject</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
