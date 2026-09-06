import React, { useState, useEffect } from 'react';
import { Footprints, Moon } from 'lucide-react';
import { calculateStepXp, calculateSleepXp } from '../lib/calculations';
import { XpProgressBar } from './XpProgressBar';

interface StepsCardProps {
  currentSteps: number;
  disabled?: boolean;
  onSave: (steps: number) => void;
}

export const StepsCard: React.FC<StepsCardProps> = ({
  currentSteps,
  disabled = false,
  onSave,
}) => {
  const [inputValue, setInputValue] = useState<string>(currentSteps > 0 ? String(currentSteps) : '');

  useEffect(() => {
    setInputValue(currentSteps > 0 ? String(currentSteps) : '');
  }, [currentSteps]);

  const earnedXp = calculateStepXp(currentSteps);
  const target = 10000;

  const handleBlur = () => {
    const num = parseInt(inputValue.replace(/,/g, ''), 10);
    if (!isNaN(num)) {
      onSave(num);
    } else if (inputValue === '') {
      onSave(0);
    }
  };

  const handleQuickAdd = (amount: number) => {
    const updated = currentSteps + amount;
    setInputValue(String(updated));
    onSave(updated);
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      earnedXp > 0
        ? 'bg-[#121E18] border-emerald-500/30 shadow-sm'
        : 'bg-[#14171D] border-white/[0.07] shadow-xs'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-zinc-500">#18</span>
              <h3 className="text-[14px] font-bold text-white tracking-tight">Steps</h3>
            </div>
            <p className="text-[11px] text-zinc-400">10,000 step daily goal</p>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black tracking-wide ${
              earnedXp > 0
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            <span>+{earnedXp}</span>
            <span className="text-[9px] font-bold">XP</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 my-2">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={disabled}
            value={inputValue}
            placeholder="Steps (e.g. 9,482)"
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="w-full h-10 px-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-sm font-bold text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
          />
        </div>

        {!disabled && (
          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              onClick={() => handleQuickAdd(1000)}
              className="h-10 px-2 rounded-xl bg-zinc-800 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-300 text-xs font-bold transition-all border border-zinc-700/60 cursor-pointer"
            >
              +1k
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(2500)}
              className="h-10 px-2 rounded-xl bg-zinc-800 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-300 text-xs font-bold transition-all border border-zinc-700/60 cursor-pointer"
            >
              +2.5k
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-zinc-800/80">
        <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1.5">
          <span>{currentSteps.toLocaleString()} / 10,000</span>
          <span className="text-emerald-400 font-bold">{Math.min(100, Math.round((currentSteps / target) * 100))}%</span>
        </div>
        <XpProgressBar current={currentSteps} total={target} heightClass="h-1.5" colorClass="bg-emerald-500" />
        <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1.5">
          <span>4k (+2) • 6k (+4) • 7.5k (+6)</span>
          <span>9k (+8) • 10k+ (+10 XP)</span>
        </div>
      </div>
    </div>
  );
};

interface SleepCardProps {
  currentHours: number;
  disabled?: boolean;
  onSave: (hours: number) => void;
}

export const SleepCard: React.FC<SleepCardProps> = ({
  currentHours,
  disabled = false,
  onSave,
}) => {
  const [inputValue, setInputValue] = useState<string>(currentHours > 0 ? String(currentHours) : '');

  useEffect(() => {
    setInputValue(currentHours > 0 ? String(currentHours) : '');
  }, [currentHours]);

  const earnedXp = calculateSleepXp(currentHours);
  const target = 8.0;

  const handleBlur = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      onSave(num);
    } else if (inputValue === '') {
      onSave(0);
    }
  };

  const handleQuickPreset = (hrs: number) => {
    setInputValue(String(hrs));
    onSave(hrs);
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      earnedXp > 0
        ? 'bg-[#121E18] border-emerald-500/30 shadow-sm'
        : 'bg-[#14171D] border-white/[0.07] shadow-xs'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-zinc-500">#19</span>
              <h3 className="text-[14px] font-bold text-white tracking-tight">Sleep</h3>
            </div>
            <p className="text-[11px] text-zinc-400">Actual hours slept</p>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black tracking-wide ${
              earnedXp > 0
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            <span>+{earnedXp}</span>
            <span className="text-[9px] font-bold">XP</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 my-2">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="decimal"
            disabled={disabled}
            value={inputValue}
            placeholder="Hours (e.g. 7.5)"
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="w-full h-10 px-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-sm font-bold text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
          />
        </div>

        {!disabled && (
          <div className="flex gap-1 shrink-0">
            {[7.0, 7.5, 8.0].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickPreset(preset)}
                className={`h-10 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  currentHours === preset
                    ? 'bg-emerald-500 border-emerald-400 text-black font-extrabold shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700/60'
                }`}
              >
                {preset}h
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-zinc-800/80">
        <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1.5">
          <span>{currentHours} / 8.0 hours</span>
          <span className="text-emerald-400 font-bold">{Math.min(100, Math.round((currentHours / target) * 100))}%</span>
        </div>
        <XpProgressBar current={currentHours} total={target} heightClass="h-1.5" colorClass="bg-cyan-400" />
        <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1.5">
          <span>&lt;5 (0) • 5h (+2) • 6h (+4)</span>
          <span>7h (+7) • 8h+ (+10 XP)</span>
        </div>
      </div>
    </div>
  );
};
