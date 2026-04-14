const notifications = [
  { id: 1, icon: '🎉', title: 'Welcome to CCI Learning Platform', msg: 'Your account has been verified. You now have full access to all study materials and AI doubt solving. All the best!', date: 'Today', unread: true, color: 'from-purple-400 to-purple-600', bg: 'from-purple-100 to-purple-200' },
  { id: 2, icon: '📚', title: 'New Study Materials Available', msg: 'Check the Subjects section for newly uploaded study materials from your teachers.', date: 'Today', unread: true, color: 'from-blue-400 to-blue-600', bg: 'from-blue-100 to-blue-200' },
  { id: 3, icon: '🤖', title: 'AI Doubt Solver is Online', msg: 'You can now ask any subject-related doubts to the AI tutor 24/7. Try it out!', date: 'Today', unread: false, color: 'from-green-400 to-green-600', bg: 'from-green-100 to-green-200' },
  { id: 4, icon: '📅', title: 'Test Schedule Updated', msg: 'New mock tests have been scheduled for next week. Check the Tests section for details.', date: 'Yesterday', unread: false, color: 'from-orange-400 to-orange-600', bg: 'from-orange-100 to-orange-200' },
  { id: 5, icon: '🏆', title: 'Achievement Unlocked', msg: 'Congratulations! You have completed 10 lessons in Physics. Keep up the great work!', date: '2 days ago', unread: false, color: 'from-pink-400 to-pink-600', bg: 'from-pink-100 to-pink-200' },
];

export default function NotificationsPage() {
  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications 🔔</h1>
        <p className="text-gray-600">Stay updated with the latest announcements.</p>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">🔔</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.unread).length}</p>
              <p className="text-sm text-gray-600">Unread</p>
            </div>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">📬</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">✅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => !n.unread).length}</p>
              <p className="text-sm text-gray-600">Read</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 animate-slide-up ${
              n.unread ? 'border-l-4 border-l-purple-500' : ''
            }`}
          >
            <div className="flex gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${n.bg} rounded-2xl flex items-center justify-center text-lg flex-shrink-0`}>
                {n.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{n.title}</h3>
                  {n.unread && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{n.msg}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{n.date}</span>
                  <button className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors">
                    {n.unread ? 'Mark as read' : 'View details'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state for when all notifications are read */}
      {notifications.filter(n => n.unread).length === 0 && (
        <div className="mt-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 shadow-lg border border-white/20 text-center">
          <div className="w-16 h-16 bg-white/50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">You have no new notifications. Check back later for updates.</p>
        </div>
      )}
    </div>
  );
}
