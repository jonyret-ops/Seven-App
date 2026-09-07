import React from 'react';
import { Target } from 'lucide-react';
import { FOCUS_XP_MAP } from '../constants';

interface FocusSelectorCardProps {
  currentRating: number;
  disabled?: boolean;
  onSelect: (rating: number) => void;
}

export const FocusSelectorCard: React.FC<FocusSelectorCardProps> = ({
  currentRating,
  disabled = false,
  onSelect,
}) => {
  const selectedObj = FOCUS_XP_MAP[currentRating];
  const earnedXp = selectedObj ? selectedObj.xp : 0;

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      earnedXp > 0
        ? 'bg-[#F7F6F2] border-[#EEEDE9] shadow-xs'
        : 'bg-white border-[#EEEDE9] shadow-xs'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#DCEAF4] text-[#12324A]">
            <Target className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#68727D]">#14</span>
              <h3 className="text-[14px] font-bold text-[#0D1B2A] tracking-tight">Daily Focus</h3>
            </div>
            <p className="text-[11px] text-[#68727D]">
              {selectedObj ? selectedObj.label : 'Select your focus rating (1–5)'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black tracking-wide ${
              earnedXp > 0
                ? 'bg-[#DCEAF4] text-[#12324A]'
                : 'bg-[#F7F6F2] text-[#68727D]'
            }`}
          >
            <span>+{earnedXp}</span>
            <span className="text-[9px] font-bold">XP</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((rating) => {
          const item = FOCUS_XP_MAP[rating];
          const isSelected = currentRating === rating;

          return (
            <button
              key={rating}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(rating)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#12324A] border-[#12324A] text-white shadow-xs font-black'
                  : 'bg-[#F7F6F2] border-[#EEEDE9] text-[#0D1B2A] hover:border-[#4A90C2]'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <span className="text-base font-black leading-tight">{rating}</span>
              <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? 'text-[#DCEAF4]' : 'text-[#68727D]'}`}>
                +{item.xp} XP
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[10px] font-semibold text-[#68727D] mt-2.5 pt-2 border-t border-[#EEEDE9]">
        <span>1: Wasted</span>
        <span>2: Below Avg</span>
        <span>3: Solid</span>
        <span>4: Productive</span>
        <span className="text-[#4A90C2] font-bold">5: Locked In</span>
      </div>
    </div>
  );
};
