import React, { useState } from 'react';
import { X, Scale } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface WeightEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeightEntryModal: React.FC<WeightEntryModalProps> = ({ isOpen, onClose }) => {
  const { addWeightEntry, activeTodayDate, weightStats, currentArc, profile } = useApp();
  const unit = profile.weightUnit || 'lb';
  const [weightInput, setWeightInput] = useState<string>(
    weightStats.currentWeight > 0 ? String(weightStats.currentWeight) : ''
  );
  const [dateInput, setDateInput] = useState<string>(activeTodayDate);
  const [noteInput, setNoteInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(weightInput);
    const minWeight = unit === 'kg' ? 25 : 50;
    const maxWeight = unit === 'kg' ? 300 : 650;

    if (isNaN(parsed) || parsed < minWeight || parsed > maxWeight) {
      setError(`Please enter a valid weight (${minWeight} - ${maxWeight} ${unit})`);
      return;
    }
    if (!dateInput) {
      setError('Please select a valid date');
      return;
    }

    addWeightEntry(parsed, dateInput, noteInput.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#14171D] rounded-3xl w-full max-w-sm p-5 border border-white/[0.1] shadow-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">Record Weigh-In</h3>
              <p className="text-[11px] text-zinc-400">
                {currentArc.goalWeight > 0 ? `Target: ${currentArc.goalWeight} ${unit}` : 'Tracking baseline'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 text-rose-300 text-xs font-semibold border border-rose-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">
              Weight ({unit.toUpperCase()})
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                required
                value={weightInput}
                onChange={(e) => {
                  setWeightInput(e.target.value);
                  setError('');
                }}
                placeholder={unit === 'kg' ? '85.0' : '185.0'}
                className="w-full h-12 px-4 bg-zinc-900 border border-zinc-700/80 rounded-2xl text-xl font-black text-white focus:outline-none focus:border-emerald-400 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 uppercase">
                {unit}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">
              Weigh-In Date
            </label>
            <input
              type="date"
              required
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full h-10 px-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-200 focus:outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Morning fasted weigh-in"
              className="w-full h-10 px-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs font-medium text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-xs transition-all cursor-pointer"
            >
              Save Weight
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
