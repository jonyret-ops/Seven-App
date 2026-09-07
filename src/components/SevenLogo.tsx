import React from 'react';

interface SevenLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showText?: boolean;
  variant?: 'circle' | 'squircle';
}

export const SevenLogo: React.FC<SevenLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  variant = 'squircle',
}) => {
  const sizeMap = {
    sm: { container: 'w-7 h-7 rounded-xl', stroke: 3, num: 'text-xs' },
    md: { container: 'w-9 h-9 rounded-2xl', stroke: 3.5, num: 'text-sm' },
    lg: { container: 'w-14 h-14 rounded-3xl', stroke: 4, num: 'text-2xl' },
    xl: { container: 'w-20 h-20 rounded-[28px]', stroke: 4.5, num: 'text-3xl' },
    '2xl': { container: 'w-28 h-28 rounded-[36px]', stroke: 5, num: 'text-5xl' },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Precision Squircle or Circle App Icon */}
      <div
        className={`relative ${current.container} ${
          variant === 'squircle'
            ? 'bg-gradient-to-b from-[#1E2533] via-[#0F141E] to-[#0A0D14] shadow-xl border border-white/10'
            : 'bg-slate-900 shadow-md'
        } flex items-center justify-center p-2 overflow-hidden select-none`}
      >
        {/* Subtle inner gloss highlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />

        {/* Circular Accent Ring with Electric Blue Gradient */}
        <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
          {/* Background circular track */}
          <circle
            cx="22"
            cy="22"
            r="17"
            stroke="#1F2937"
            strokeWidth={current.stroke}
            fill="none"
          />
          {/* Glowing Arc Segment in Electric Blue / Cyan */}
          <circle
            cx="22"
            cy="22"
            r="17"
            stroke="url(#blueGradient)"
            strokeWidth={current.stroke + 0.5}
            fill="none"
            strokeDasharray="106.8"
            strokeDashoffset="32"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Stylized Numeral 7 */}
        <span
          className={`absolute font-black tracking-tighter text-white select-none ${current.num} drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          7
        </span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-black tracking-widest text-slate-900 text-lg">
            SEVEN
          </span>
          <span className="text-[9px] font-bold tracking-widest text-blue-600 uppercase -mt-0.5">
            DISCIPLINE
          </span>
        </div>
      )}
    </div>
  );
};
