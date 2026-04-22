import { useEffect, useRef } from 'react';

export default function useScreenshotProtection() {
  const isActive = useRef(false);

  useEffect(() => {
    // Prevent screenshots on web
    const preventScreenshot = () => {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('keydown', (e) => {
        // Block screenshot shortcuts
        if (
          (e.ctrlKey && e.shiftKey && e.key === 'S') ||
          (e.metaKey && e.shiftKey && e.key === 'S') ||
          (e.ctrlKey && e.key === 'p') ||
          (e.metaKey && e.key === 'p') ||
          (e.ctrlKey && e.key === 'PrintScreen') ||
          (e.metaKey && e.key === 'PrintScreen') ||
          (e.ctrlKey && e.key === 'I') ||
          (e.metaKey && e.key === 'I')
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    };

    // Disable text selection
    const preventSelection = () => {
      document.addEventListener('selectstart', (e) => e.preventDefault());
      document.addEventListener('dragstart', (e) => e.preventDefault());
    };

    // Blur content when page loses focus
    const handleBlur = () => {
      document.body.style.filter = 'blur(8px)';
      isActive.current = true;
    };

    const handleFocus = () => {
      document.body.style.filter = 'none';
      isActive.current = false;
    };

    // Add watermark to all images
    const addWatermarkToImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.style.pointerEvents = 'none';
        img.style.userSelect = 'none';
        img.draggable = false;
        
        // Create watermark overlay
        const watermark = document.createElement('div');
        watermark.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          pointer-events: none;
          z-index: 9999;
        `;
        watermark.textContent = 'PROTECTED';
        
        img.parentElement?.style.setProperty('position', 'relative');
        img.parentElement?.appendChild(watermark);
      });
    };

    preventScreenshot();
    preventSelection();
    addWatermarkToImages();

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('load', addWatermarkToImages);

    return () => {
      document.removeEventListener('contextmenu', preventScreenshot);
      document.removeEventListener('keydown', preventScreenshot);
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('dragstart', preventSelection);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('load', addWatermarkToImages);
    };
  }, []);

  return { isActive: isActive.current };
}
