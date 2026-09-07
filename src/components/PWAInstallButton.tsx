import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'badge' | 'full' | 'subtle';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'badge',
}) => {
  const { canInstall, isInstalled, isIOS, hasNativePrompt, installPWA } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If app is already installed in standalone mode, do not render
  if (isInstalled || !canInstall) {
    return null;
  }

  const handleClick = async () => {
    if (hasNativePrompt) {
      await installPWA();
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'badge' && (
        <button
          type="button"
          onClick={handleClick}
          className={`h-9 px-3 rounded-xl bg-[#DCEAF4] hover:bg-[#c9e1f0] text-[#12324A] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${className}`}
          title="Install SEVEN as an app"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'full' && (
        <button
          type="button"
          onClick={handleClick}
          className={`w-full py-3 px-3 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Install SEVEN on Home Screen</span>
        </button>
      )}

      {variant === 'subtle' && (
        <button
          type="button"
          onClick={handleClick}
          className={`flex items-center gap-1 text-xs font-bold text-[#4A90C2] hover:underline transition-colors cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
      )}

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 border border-[#EEEDE9] shadow-2xl text-[#0D1B2A] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#12324A] text-white flex items-center justify-center font-black">
                  7
                </div>
                <h3 className="text-base font-black text-[#0D1B2A] tracking-tight">
                  Install SEVEN App
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-8 h-8 rounded-xl bg-[#F7F6F2] border border-[#EEEDE9] flex items-center justify-center text-[#68727D] hover:text-[#0D1B2A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#68727D] leading-relaxed font-medium">
              Install SEVEN to your device home screen for fullscreen offline access, instant load times, and uninterrupted tracking:
            </p>

            <div className="space-y-2.5 text-xs text-[#0D1B2A]">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9]">
                <div className="w-6 h-6 rounded-lg bg-[#DCEAF4] text-[#12324A] flex items-center justify-center shrink-0 mt-0.5">
                  <Share className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-black text-[#0D1B2A] block">1. Tap Share</span>
                  <span className="text-[#68727D] text-[11px]">
                    Tap the Share button in Safari's bottom toolbar
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9]">
                <div className="w-6 h-6 rounded-lg bg-[#DCEAF4] text-[#12324A] flex items-center justify-center shrink-0 mt-0.5">
                  <PlusSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-black text-[#0D1B2A] block">2. Add to Home Screen</span>
                  <span className="text-[#68727D] text-[11px]">
                    Scroll down and tap 'Add to Home Screen'
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9]">
                <div className="w-6 h-6 rounded-lg bg-[#DCEAF4] text-[#12324A] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-black text-[#0D1B2A] block">3. Open from Home Screen</span>
                  <span className="text-[#68727D] text-[11px]">
                    Launch SEVEN from your home screen for full native feel
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-2xl bg-[#12324A] text-white text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
