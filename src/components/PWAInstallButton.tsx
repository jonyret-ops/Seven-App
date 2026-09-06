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
          className={`h-8 px-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${className}`}
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
          className={`w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Install SEVEN on Home Screen</span>
        </button>
      )}

      {variant === 'subtle' && (
        <button
          type="button"
          onClick={handleClick}
          className={`flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
      )}

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#14171D] rounded-3xl w-full max-w-sm p-5 border border-white/[0.1] shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  7
                </div>
                <h3 className="text-base font-black text-white tracking-tight">
                  Install SEVEN App
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Install SEVEN to your device home screen for fullscreen offline access, instant load times, and uninterrupted tracking:
            </p>

            <div className="space-y-3 bg-zinc-900/90 p-3.5 rounded-2xl border border-white/[0.05]">
              <div className="flex items-start gap-2.5 text-xs text-zinc-200">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-zinc-300">
                  <Share className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white block">1. Tap the Share button</span>
                  <span className="text-[11px] text-zinc-400">Located in your browser toolbar (bottom or top).</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-zinc-200">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-zinc-300">
                  <PlusSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white block">2. Select &quot;Add to Home Screen&quot;</span>
                  <span className="text-[11px] text-zinc-400">Scroll down the share options sheet and tap Add.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-zinc-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white block">3. Open from your Home Screen</span>
                  <span className="text-[11px] text-zinc-400">Launch anytime 100% offline with zero lag.</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black transition-all cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
