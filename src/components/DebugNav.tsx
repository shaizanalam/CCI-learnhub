import { useNavigate } from 'react-router-dom';

export default function DebugNav() {
  const navigate = useNavigate();
  
  return (
    <div className="fixed top-20 right-4 bg-red-500 text-white p-4 rounded-lg z-[9999] md:hidden">
      <p className="text-sm font-bold mb-2">Debug Navigation</p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="block w-full bg-white text-red-500 px-2 py-1 rounded text-xs mb-1"
      >
        Dashboard
      </button>
      <button 
        onClick={() => navigate('/subjects')}
        className="block w-full bg-white text-red-500 px-2 py-1 rounded text-xs mb-1"
      >
        Subjects
      </button>
      <button 
        onClick={() => navigate('/chat')}
        className="block w-full bg-white text-red-500 px-2 py-1 rounded text-xs mb-1"
      >
        Chat
      </button>
      <button 
        onClick={() => navigate('/notifications')}
        className="block w-full bg-white text-red-500 px-2 py-1 rounded text-xs"
      >
        Notifications
      </button>
    </div>
  );
}
