import { useRef, useEffect } from 'react';

interface MorphingRingProps {
  seconds: number;
  label?: string;
}

export default function MorphingRing({ seconds, label = 'ACTIVE' }: MorphingRingProps) {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    const borderEl = el.querySelector('.morph-border') as HTMLElement | null;
    const blobEl = el.querySelector('.morph-blob') as HTMLElement | null;
    if (!borderEl || !blobEl) return;

    borderEl.style.background = 'conic-gradient(from 0deg, transparent 0%, #ff6600 20%, #ff0080 50%, #ff6600 80%, transparent 100%)';
    blobEl.style.filter = 'blur(40px)';
    blobEl.style.opacity = '0.8';
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <div
      ref={ringRef}
      className="relative flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden"
      style={{ boxShadow: '0 0 50px rgba(255,102,0,0.3)' }}
    >
      <div className="morph-border absolute inset-0 rounded-full z-10 pointer-events-none" />
      <div className="morph-blob absolute w-44 h-44 sm:w-48 sm:h-48 bg-gradient-to-br from-[#ff0080] to-[#ff4800] z-0" />
      <div className="relative z-20 flex flex-col items-center text-white">
        <div className="text-5xl sm:text-6xl font-black tracking-tighter tabular-nums">
          {mins}:{secs}
        </div>
        <div className="text-xs uppercase tracking-widest text-white/70 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}
