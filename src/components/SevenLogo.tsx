import React from 'react';

interface SevenLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const SevenLogo: React.FC<SevenLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const sizeMap = {
    sm: { container: 'w-7 h-7', text: 'text-sm', num: 'text-sm' },
    md: { container: 'w-9 h-9', text: 'text-lg', num: 'text-base' },
    lg: { container: 'w-14 h-14', text: 'text-2xl', num: 'text-2xl' },
    xl: { container: 'w-20 h-20', text: 'text-3xl', num: 'text-3xl' },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Precision Segmented Dial 7 Badge */}
      <div className={`relative ${current.container} flex items-center justify-center`}>
        {/* Outer Circular Track */}
        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
          {/* Background track circle */}
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-zinc-800"
          />
          {/* Accent Arc segment in vivid green */}
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="2.8"
            fill="none"
            strokeDasharray="100.5"
            strokeDashoffset="28"
            strokeLinecap="round"
            className="text-emerald-400"
          />
          {/* Glowing tick dot */}
          <circle
            cx="36"
            cy="20"
            r="1.8"
            fill="#34D399"
          />
        </svg>

        {/* Center stylized numeral 7 */}
        <span
          className={`absolute font-black tracking-tighter text-white select-none ${current.num}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          7
        </span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-wider text-white ${current.text}`}>
            SEVEN
          </span>
          <span className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase -mt-0.5">
            LOCKED IN
          </span>
        </div>
      )}
    </div>
  );
};
