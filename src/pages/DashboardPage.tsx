import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Play, FileText, Target, TrendingUp, Bell, User, Clock, Calendar, ChevronRight, BarChart3, Award, Users, Bot, Coffee, Home, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';

const quickActions = [
  { title: 'My Subjects', icon: BookOpen, color: 'from-purple-400 to-purple-600', path: '/subjects' },
  { title: 'AI Doubt Solver', icon: Bot, color: 'from-green-400 to-green-600', path: '/chat' },
  { title: 'Notifications', icon: Bell, color: 'from-blue-400 to-blue-600', path: '/notifications' },
  { title: 'Test Series', icon: FileText, color: 'from-orange-400 to-orange-600', path: '/tests' },
  { title: 'Performance', icon: TrendingUp, color: 'from-pink-400 to-pink-600', path: '/performance' },
  { title: 'Study Break', icon: Coffee, color: 'from-indigo-400 to-indigo-600', path: '/break' },
];

const recentVideos = [];
const upcomingTests = [];

const features = [
  { title: 'My Subjects', desc: 'Browse subjects and access chapter-wise notes, videos & practice sheets.', icon: '📚', color: 'purple', path: '/subjects' },
  { title: 'AI Doubt Solver', desc: 'Get instant answers to your doubts — powered by AI, available 24/7.', icon: '🤖', color: 'green', path: '/chat' },
  { title: 'Notifications', desc: 'Class schedules, test alerts, new material uploads and announcements.', icon: '🔔', color: 'cyan', path: '/notifications' },
];


export default function DashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-200">
                <Logo size="md" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">10th Classroom</h1>
                <p className="text-xs text-gray-500">Change course</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 pb-24">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chapters, videos & more"
              className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-sm"
            />
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 sm:p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                Welcome back, {profile?.name?.split(' ')[0] || 'Student'} 👋
              </h2>
              <p className="text-sm text-gray-700">Ready to continue your Class 10 preparation?</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${action.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-800 text-center">{action.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Videos */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Continue Learning</h3>
            <button className="text-sm text-purple-600 font-medium">View All</button>
          </div>
          {recentVideos.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-900 font-medium mb-2">No recent videos</h4>
              <p className="text-gray-500 text-sm">Start watching videos to see your progress here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {recentVideos.map((video, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 truncate">{video.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">{video.duration}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                          style={{ width: `${video.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tests */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Tests</h3>
            <button className="text-sm text-purple-600 font-medium">View All</button>
          </div>
          {upcomingTests.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-900 font-medium mb-2">No upcoming tests</h4>
              <p className="text-gray-500 text-sm">Check back later for scheduled tests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTests.map((test, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{test.title}</h4>
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {test.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {test.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs sm:text-sm font-medium hover:shadow-lg transition-all duration-200 whitespace-nowrap">
                      Start Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Card */}
        <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Your Performance</h3>
              <p className="text-sm text-gray-700 mb-4">Start learning to track your progress</p>
              <div className="flex items-center gap-4 sm:gap-6">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">--%</p>
                  <p className="text-xs sm:text-sm text-gray-600">Average Score</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">0</p>
                  <p className="text-xs sm:text-sm text-gray-600">Tests Completed</p>
                </div>
              </div>
            </div>
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/50 rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <button className="flex flex-col items-center gap-1 p-3 rounded-2xl text-purple-600">
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 rounded-2xl text-gray-400 hover:text-gray-600 transition-colors">
              <BookOpen className="w-6 h-6" />
              <span className="text-xs font-medium">Study</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 rounded-2xl text-gray-400 hover:text-gray-600 transition-colors">
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Doubts</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 rounded-2xl text-gray-400 hover:text-gray-600 transition-colors">
              <Coffee className="w-6 h-6" />
              <span className="text-xs font-medium">Break</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 rounded-2xl text-gray-400 hover:text-gray-600 transition-colors">
              <FileText className="w-6 h-6" />
              <span className="text-xs font-medium">Tests</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
