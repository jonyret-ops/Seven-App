import React, { useState } from 'react';
import { Utensils, Plus, Settings2, Trash2, Flame, Dumbbell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MealEntryModal } from './MealEntryModal';
import { NutritionSettingsModal } from './NutritionSettingsModal';

export const NutritionCard: React.FC = () => {
  const {
    selectedDateMacros,
    selectedDateMealLogs,
    deleteMealLog,
    isDateFuture,
    selectedDate,
  } = useApp();

  const [isLogMealOpen, setIsLogMealOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isFuture = isDateFuture(selectedDate);
  const {
    calories,
    protein,
    carbs,
    fat,
    caloriesTarget = 2400,
    proteinTarget = 180,
    carbsTarget = 220,
    fatTarget = 65,
    proteinPercent,
    carbsPercent,
    fatPercent,
  } = selectedDateMacros;

  const calPercent = Math.min(100, Math.round((calories / (caloriesTarget || 1)) * 100));

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
            <Utensils className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-[#0D1B2A] uppercase tracking-wider">
                Nutrition & Fuel
              </h3>
              {proteinPercent >= 100 && (
                <span className="px-2 py-0.5 rounded-full bg-[#DCEAF4] text-[#12324A] text-[9px] font-black">
                  PROTEIN HIT
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#68727D]">Daily intake & macro targets</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-[#F7F6F2] border border-[#EEEDE9] text-[#68727D] hover:text-[#0D1B2A] transition-colors cursor-pointer"
            title="Configure Targets"
          >
            <Settings2 className="w-4 h-4 stroke-[1.75]" />
          </button>
          {!isFuture && (
            <button
              type="button"
              onClick={() => setIsLogMealOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2]" />
              <span>Log Meal</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Macro Rings / Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Calories */}
        <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#68727D] mb-1">
            <span>Calories</span>
            <Flame className="w-3 h-3 text-[#12324A] stroke-[1.75]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#0D1B2A]">{calories}</span>
            <span className="text-[10px] text-[#68727D]">/ {caloriesTarget}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#EEEDE9] mt-2 overflow-hidden">
            <div
              className="h-full bg-[#12324A] rounded-full transition-all"
              style={{ width: `${calPercent}%` }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#68727D] mb-1">
            <span>Protein</span>
            <Dumbbell className="w-3 h-3 text-[#4A90C2] stroke-[1.75]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#0D1B2A]">{protein}g</span>
            <span className="text-[10px] text-[#68727D]">/ {proteinTarget}g</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#EEEDE9] mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all bg-[#4A90C2]"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#68727D] mb-1">
            <span>Carbs</span>
            <span className="text-[10px] font-bold text-[#68727D]">{carbsPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#0D1B2A]">{carbs}g</span>
            <span className="text-[10px] text-[#68727D]">/ {carbsTarget}g</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#EEEDE9] mt-2 overflow-hidden">
            <div
              className="h-full bg-[#12324A]/70 rounded-full transition-all"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
        </div>

        {/* Fats */}
        <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#68727D] mb-1">
            <span>Fats</span>
            <span className="text-[10px] font-bold text-[#68727D]">{fatPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#0D1B2A]">{fat}g</span>
            <span className="text-[10px] text-[#68727D]">/ {fatTarget}g</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#EEEDE9] mt-2 overflow-hidden">
            <div
              className="h-full bg-[#68727D] rounded-full transition-all"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Logged Meals List */}
      <div className="space-y-2 pt-1">
        {selectedDateMealLogs.length === 0 ? (
          <div className="py-4 text-center text-xs text-[#68727D] border border-dashed border-[#EEEDE9] rounded-2xl bg-[#F7F6F2]">
            No meals logged for this day. Tap "Log Meal" to track fuel.
          </div>
        ) : (
          selectedDateMealLogs.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EEEDE9] hover:border-[#4A90C2] transition-all"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F7F6F2] text-[#12324A]">
                    {meal.mealType}
                  </span>
                  <h4 className="text-xs font-black text-[#0D1B2A] truncate">
                    {meal.name}
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#68727D] mt-1 font-medium">
                  <span className="text-[#0D1B2A] font-bold">{meal.calories} kcal</span>
                  <span>{meal.protein}g P</span>
                  <span>{meal.carbs}g C</span>
                  <span>{meal.fat}g F</span>
                </div>
              </div>

              {!isFuture && (
                <button
                  type="button"
                  onClick={() => deleteMealLog(meal.id)}
                  className="p-1.5 text-[#68727D]/60 hover:text-red-500 rounded-lg hover:bg-[#F7F6F2] transition-colors ml-2 cursor-pointer"
                  title="Delete Meal"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <MealEntryModal
        isOpen={isLogMealOpen}
        onClose={() => setIsLogMealOpen(false)}
        targetDate={selectedDate}
      />

      <NutritionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
