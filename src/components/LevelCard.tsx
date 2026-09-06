import React from 'react';
import { useApp } from '../context/AppContext';
import { XpProgressBar } from './XpProgressBar';
import { SevenLogo } from './SevenLogo';
import { Activity } from 'lucide-react';

export const LevelCard: React.FC = () => {
  const { levelInfo, totalCumulativeXp, statusSnapshot } = useApp();

  const xpNeeded = Math.max(1, levelInfo.nextLevelXpRequired - levelInfo.currentLevelXpRequired);

  return (
    <div className="bg-[#14171D] rounded-2xl p-4 border border-white/[0.08] shadow-sm transition-all hover:border-white/[0.14]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <SevenLogo size="sm" />
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-black tracking-tight text-white">
                LEVEL {levelInfo.currentLevel}
              </h2>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                • {levelInfo.currentTitle}
              </span>
            </div>
            {/* Status indicator */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34D399]" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400">
                STATUS: {statusSnapshot.currentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-zinc-500 uppercase block tracking-wider">Total XP</span>
          <span className="text-sm font-black text-zinc-100">
            {totalCumulativeXp.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <XpProgressBar
          current={levelInfo.xpInCurrentLevel}
          total={xpNeeded}
          heightClass="h-1.5"
          colorClass="bg-emerald-400"
        />

        <div className="flex justify-between items-center text-[11px] font-medium text-zinc-400 pt-0.5">
          <span>
            {levelInfo.xpInCurrentLevel} / {xpNeeded} XP
          </span>
          {levelInfo.isMaxLevel ? (
            <span className="font-extrabold text-emerald-400 text-[10px]">MAX LEVEL REACHED</span>
          ) : (
            <span className="font-semibold text-zinc-400 text-[10px]">
              {levelInfo.xpNeededForNextLevel} XP to Level {levelInfo.currentLevel + 1}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
