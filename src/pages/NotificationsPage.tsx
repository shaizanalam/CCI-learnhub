const notifications = [];

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
      {notifications.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔔</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You're all caught up! Check back later for new updates.</p>
        </div>
      ) : (
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
      )}

    </div>
  );
}
