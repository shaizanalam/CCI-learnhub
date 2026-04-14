import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, BookOpen, Play, FileText, Target } from 'lucide-react';

interface Subject {
  id: string;
  name: string | null;
  class: string | null;
}

const subjectEmojis: Record<string, string> = {};
const subjectColors: Record<string, { gradient: string; bg: string }> = {};
const subjectStats: Record<string, { chapters: number; videos: number; tests: number }> = {};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      let timeoutId: NodeJS.Timeout;
      try {
        timeoutId = setTimeout(() => {
          setLoading(false);
        }, 5000);

        const { data, error } = await supabase.from('subjects').select('*');
        if (error) {
          setSubjects([]);
          return;
        }
        setSubjects(data || []);
      } catch (error) {
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
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-lg">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
          <p className="text-gray-600 mt-4">Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-lg max-w-md">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Subjects Found</h3>
          <p className="text-gray-600">Subjects haven't been added yet. Please contact your admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subjects..."
            className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-sm"
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Subjects 📚</h1>
        <p className="text-gray-600">Select a subject to view study materials.</p>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {subjects.map(s => {
          const key = (s.name || '').toLowerCase();
          const emoji = subjectEmojis[key] || '📚';
          const colors = subjectColors[key] || { gradient: 'from-purple-400 to-purple-600', bg: 'from-purple-100 to-purple-200' };
          const stats = subjectStats[key] || { chapters: 0, videos: 0, tests: 0 };
          return (
            <div
              key={s.id}
              onClick={() => navigate(`/subjects/${s.id}`)}
              className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
            >
              {/* Subject Header */}
              <div className={`bg-gradient-to-br ${colors.bg} rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${colors.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center`}>
                    <span className="text-xl sm:text-2xl">{emoji}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 bg-white/80 px-2 py-1 rounded-full">
                    {s.class || 'General'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{s.name}</h3>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                <div className="text-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <p className="text-sm sm:text-lg font-bold text-gray-900">{stats.chapters}</p>
                  <p className="text-xs text-gray-500">Chapters</p>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1">
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <p className="text-sm sm:text-lg font-bold text-gray-900">{stats.videos}</p>
                  <p className="text-xs text-gray-500">Videos</p>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <p className="text-sm sm:text-lg font-bold text-gray-900">{stats.tests}</p>
                  <p className="text-xs text-gray-500">Tests</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-600">Progress</span>
                  <span className="text-xs font-medium text-purple-600">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium text-xs sm:text-sm hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                Continue Learning
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Your Learning Progress</h3>
            <p className="text-sm text-gray-700 mb-4">Start exploring subjects to track your progress</p>
            <div className="flex items-center gap-4 sm:gap-6">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{subjects.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Available Subjects</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-green-600">--%</p>
                <p className="text-xs sm:text-sm text-gray-600">Avg. Progress</p>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/50 rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0">
            <Target className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
