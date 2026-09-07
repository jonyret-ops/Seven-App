import React from 'react';

interface ProfileIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  strokeWidth?: number;
}

/**
 * Minimalist person/profile icon in SEVEN's signature deep navy.
 * Clean rounded strokes, minimal outline, no facial details, no photos, no green.
 */
export const ProfileIcon: React.FC<ProfileIconProps> = ({
  size = 'md',
  className = '',
  strokeWidth = 1.8,
}) => {
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
    xl: 'w-12 h-12',
  };

  const iconClass = sizeMap[size] || sizeMap.md;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#12324A"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${iconClass} shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Minimalist head outline */}
      <circle cx="12" cy="8" r="4.2" />
      {/* Minimalist shoulders & torso outline */}
      <path d="M4.5 20.25C4.5 16.5 7.85 13.5 12 13.5C16.15 13.5 19.5 16.5 19.5 20.25" />
    </svg>
  );
};
