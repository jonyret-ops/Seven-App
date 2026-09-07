import React from 'react';
import { useApp } from '../context/AppContext';
import { XpProgressBar } from './XpProgressBar';
import { SevenLogo } from './SevenLogo';

export const LevelCard: React.FC = () => {
  const { levelInfo, totalCumulativeXp, statusSnapshot } = useApp();

  const xpNeeded = Math.max(1, levelInfo.nextLevelXpRequired - levelInfo.currentLevelXpRequired);

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#EEEDE9] shadow-xs transition-all hover:border-[#4A90C2]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <SevenLogo size="sm" />
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-black tracking-tight text-[#0D1B2A]">
                LEVEL {levelInfo.currentLevel}
              </h2>
              <span className="text-xs font-bold text-[#68727D] uppercase tracking-wider">
                • {levelInfo.currentTitle}
              </span>
            </div>
            {/* Status indicator */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#12324A]" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#12324A]">
                STATUS: {statusSnapshot.currentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-[#68727D] uppercase block tracking-wider">Total XP</span>
          <span className="text-sm font-black text-[#0D1B2A]">
            {totalCumulativeXp.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <XpProgressBar
          current={levelInfo.xpInCurrentLevel}
          total={xpNeeded}
          heightClass="h-1.5"
          colorClass="bg-[#12324A]"
        />

        <div className="flex justify-between items-center text-[11px] font-medium text-[#68727D] pt-0.5">
          <span>
            {levelInfo.xpInCurrentLevel} / {xpNeeded} XP
          </span>
          {levelInfo.isMaxLevel ? (
            <span className="font-extrabold text-[#12324A] text-[10px]">MAX LEVEL REACHED</span>
          ) : (
            <span className="font-semibold text-[#68727D] text-[10px]">
              {levelInfo.xpNeededForNextLevel} XP to Level {levelInfo.currentLevel + 1}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
