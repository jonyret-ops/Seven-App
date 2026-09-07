import React, { useState } from 'react';
import { X, Target, Flame, Dumbbell } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NutritionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NutritionSettingsModal: React.FC<NutritionSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { nutritionSettings, updateNutritionSettings } = useApp();

  const [caloriesTarget, setCaloriesTarget] = useState(String(nutritionSettings?.caloriesTarget || 2200));
  const [proteinTarget, setProteinTarget] = useState(String(nutritionSettings?.proteinTarget || 180));
  const [carbsTarget, setCarbsTarget] = useState(String(nutritionSettings?.carbsTarget || 210));
  const [fatTarget, setFatTarget] = useState(String(nutritionSettings?.fatTarget || 70));

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateNutritionSettings({
      caloriesTarget: parseInt(caloriesTarget, 10) || 2200,
      proteinTarget: parseInt(proteinTarget, 10) || 180,
      carbsTarget: parseInt(carbsTarget, 10) || 210,
      fatTarget: parseInt(fatTarget, 10) || 70,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EEEDE9] shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#68727D] hover:text-[#0D1B2A] hover:bg-[#F2F1ED] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#0D1B2A]">Daily Macro Targets</h2>
            <p className="text-xs text-[#68727D] font-medium">Manually configure your daily nutrition targets</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                Target Calories (kcal)
              </label>
              <input
                type="number"
                value={caloriesTarget}
                onChange={(e) => setCaloriesTarget(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#EEEDE9] focus:border-[#4A90C2] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#0D1B2A] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                Target Protein (g)
              </label>
              <input
                type="number"
                value={proteinTarget}
                onChange={(e) => setProteinTarget(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#EEEDE9] focus:border-[#4A90C2] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#0D1B2A] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                Target Carbs (g)
              </label>
              <input
                type="number"
                value={carbsTarget}
                onChange={(e) => setCarbsTarget(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#EEEDE9] focus:border-[#4A90C2] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#0D1B2A] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                Target Fat (g)
              </label>
              <input
                type="number"
                value={fatTarget}
                onChange={(e) => setFatTarget(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#EEEDE9] focus:border-[#4A90C2] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#0D1B2A] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer min-h-[44px]"
          >
            Save Targets
          </button>
        </form>
      </div>
    </div>
  );
};
