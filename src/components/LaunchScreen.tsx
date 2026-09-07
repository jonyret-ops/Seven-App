import React from 'react';
import { SevenLogo } from './SevenLogo';
import { mountainPeaks } from '../assets/images';

interface LaunchScreenProps {
  onGetStarted: () => void;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#F7F6F2] flex flex-col justify-between select-none overflow-hidden animate-in fade-in duration-300">
      {/* Top Reserved iOS Safe Area (62px reference, adapts dynamically via env) */}
      <div 
        className="w-full shrink-0" 
        style={{ height: 'max(env(safe-area-inset-top, 0px), 62px)' }} 
        aria-hidden="true" 
      />

      {/* Center Branding - App Icon, Title, Philosophy (Begins BELOW the safe area) */}
      <div className="flex flex-col items-center justify-center px-6 text-center my-auto">
        {/* Modern Squircle 7 Icon with Glowing Ring */}
        <div className="mb-6 drop-shadow-md">
          <SevenLogo size="2xl" variant="squircle" />
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl sm:text-3xl font-black text-[#0D1B2A] tracking-[0.4em] pl-[0.4em] uppercase mb-2">
          SEVEN
        </h1>

        {/* Philosophy Motto */}
        <p className="text-[11px] sm:text-xs font-bold tracking-widest text-[#68727D] uppercase max-w-xs">
          EVERY DAY IS A STEP TOWARD GREATNESS.
        </p>
      </div>

      {/* Bottom Scenic Landscape & Action Buttons */}
      <div className="relative w-full shrink-0">
        {/* Mountain Peaks Scenic Graphic */}
        <div className="relative w-full h-64 sm:h-72 overflow-hidden">
          <img
            src={mountainPeaks}
            alt="Alpine Peaks"
            className="w-full h-full object-cover object-bottom"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay to smoothly blend image into buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F6F2] via-transparent to-transparent" />
        </div>

        {/* Action Button above reserved bottom safe area */}
        <div 
          className="absolute left-0 right-0 px-6 max-w-md mx-auto"
          style={{
            bottom: 'max(env(safe-area-inset-bottom, 0px), 34px)',
          }}
        >
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full py-4 rounded-full bg-[#12324A] hover:bg-[#0D1B2A] text-white text-sm font-bold shadow-md cursor-pointer transition-all active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
