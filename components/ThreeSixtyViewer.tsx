
import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, MousePointer2, MoveHorizontal } from 'lucide-react';

interface Props {
  frames: string[];
}

const ThreeSixtyViewer: React.FC<Props> = ({ frames }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const sensitivity = 50; // pixels per frame change

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const currentX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const diff = currentX - startX.current;

    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? -1 : 1;
      setCurrentIndex((prev) => (prev + direction + frames.length) % frames.length);
      startX.current = currentX;
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="relative w-full aspect-video bg-zinc-950 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing group">
      <div 
        className="w-full h-full"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <img 
          src={frames[currentIndex]} 
          alt={`360 Frame ${currentIndex}`} 
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      </div>

      {/* Repositioned 'Drag to Rotate' overlay to the bottom */}
      <div className="absolute inset-x-0 bottom-20 pointer-events-none flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-5 py-2.5 rounded-full flex items-center gap-2.5 text-white/90 shadow-2xl">
          <MoveHorizontal className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.15em] uppercase">DRAG TO ROTATE VEHICLE</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
        {frames.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-orange-500 w-6' : 'bg-zinc-700 w-1.5'}`}
          />
        ))}
      </div>

      <div className="absolute top-6 right-6 bg-zinc-900/95 border border-zinc-800 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg">
        <span className="text-[10px] font-orbitron font-black text-orange-500 uppercase tracking-widest flex items-center gap-2.5 italic">
          <RotateCcw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
          INTERACTIVE 3D
        </span>
      </div>
    </div>
  );
};

export default ThreeSixtyViewer;
