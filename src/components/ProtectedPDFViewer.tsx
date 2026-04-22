import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { X, Download, Shield, Eye } from 'lucide-react';

interface ProtectedPDFViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export default function ProtectedPDFViewer({ pdfUrl, title, onClose }: ProtectedPDFViewerProps) {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pageScale, setPageScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showWatermark, setShowWatermark] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent screenshot shortcuts
      if ((e.key === 'PrintScreen') || 
          (e.ctrlKey && e.shiftKey && e.key === 'S') ||
          (e.metaKey && e.shiftKey && e.key === 'S') ||
          (e.ctrlKey && e.key === 'p') ||
          (e.metaKey && e.key === 'p')) {
        e.preventDefault();
        return false;
      }
      
      // Prevent developer tools
      if ((e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.metaKey && e.altKey && e.key === 'I')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Load PDF and render with watermark
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        
        // For demo purposes, we'll create a canvas-based PDF viewer
        // In production, you'd use react-pdf or similar library
        const canvas = canvasRef.current;
        const container = containerRef.current;
        
        if (canvas && container) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Set canvas size
            canvas.width = 800;
            canvas.height = 1000;
            
            // Clear canvas
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw PDF content placeholder
            ctx.fillStyle = '#333333';
            ctx.font = '16px Arial';
            ctx.fillText('PDF Content would be rendered here', 50, 100);
            ctx.fillText(`Title: ${title}`, 50, 150);
            ctx.fillText(`Page ${currentPage} of ${totalPages || 1}`, 50, 200);
            
            // Add watermark overlay
            if (showWatermark) {
              ctx.save();
              
              // Set watermark properties
              ctx.globalAlpha = 0.3;
              ctx.fillStyle = '#ff0000';
              ctx.font = 'bold 24px Arial';
              
              // Add user email watermark
              const userEmail = profile?.email || 'Unknown User';
              ctx.fillText(`Protected Content - ${userEmail}`, 50, canvas.height / 2);
              
              // Add "PROTECTED" text
              ctx.font = 'bold 48px Arial';
              ctx.globalAlpha = 0.2;
              ctx.fillText('PROTECTED', canvas.width / 2 - 100, canvas.height / 2);
              
              // Add timestamp
              ctx.font = '14px Arial';
              ctx.globalAlpha = 0.5;
              const timestamp = new Date().toLocaleString();
              ctx.fillText(timestamp, 50, canvas.height - 50);
              
              ctx.restore();
            }
            
            setTotalPages(1); // Mock total pages
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl, title, showWatermark, profile]);

  const handleZoomIn = () => {
    setPageScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setPageScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] h-[95vh] max-w-6xl max-h-[900px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">Protected Content - View Only</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* PDF Viewer */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto relative bg-gray-50"
          style={{ transform: `scale(${pageScale})` }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading protected content...</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border border-gray-300 shadow-lg"
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
              
              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  Next
                </button>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    Zoom Out
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    Zoom In
                  </button>
                </div>
                
                <button
                  onClick={() => setShowWatermark(!showWatermark)}
                  className={`p-2 rounded ${showWatermark ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showWatermark ? 'Hide' : 'Show'} Watermark
                </button>
              </div>
            </div>
          )}
          
          {/* Protection Notice */}
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
            🔒 PROTECTED CONTENT
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Content is protected and cannot be downloaded</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{profile?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
