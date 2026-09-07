import React, { useState } from 'react';
import { X, Utensils, Flame, Dumbbell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MealType } from '../types';

interface MealEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDate?: string;
}

const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
];

export const MealEntryModal: React.FC<MealEntryModalProps> = ({
  isOpen,
  onClose,
  targetDate,
}) => {
  const { addMealLog, selectedDate, activeTodayDate } = useApp();
  const dateToUse = targetDate || selectedDate || activeTodayDate;

  const [name, setName] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [calories, setCalories] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [fat, setFat] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cals = parseInt(calories, 10) || 0;
    const p = parseInt(protein, 10) || 0;
    const c = parseInt(carbs, 10) || 0;
    const f = parseInt(fat, 10) || 0;

    await addMealLog({
      date: dateToUse,
      name: name.trim() || 'Meal',
      mealType,
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
    });

    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Log Meal / Fuel</h2>
            <p className="text-xs text-slate-400 font-medium">Record macros for {dateToUse}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Meal Type Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Meal Timing
            </label>
            <div className="grid grid-cols-4 gap-2">
              {MEAL_TYPES.map((type) => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setMealType(type.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                    mealType === type.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description / Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Meal Name / Foods
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Oatmeal, eggs, yogurt"
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Calories */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Calories (kcal)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="520"
                  min="0"
                  max="10000"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
                <Flame className="w-4 h-4 text-orange-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Protein */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Protein (g)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="40"
                  min="0"
                  max="1000"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
                <Dumbbell className="w-4 h-4 text-blue-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Carbohydrates (g)
              </label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="55"
                min="0"
                max="1000"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            {/* Fats */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Fats (g)
              </label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="15"
                min="0"
                max="1000"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#111827] hover:bg-black text-white font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            Save Meal
          </button>
        </form>
      </div>
    </div>
  );
};
