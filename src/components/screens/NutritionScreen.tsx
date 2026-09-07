import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Target, 
  Trash2, 
  Copy, 
  Utensils, 
  Flame,
  Sun,
  Coffee,
  Soup,
  Moon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MealEntryModal } from '../MealEntryModal';
import { NutritionSettingsModal } from '../NutritionSettingsModal';
import { DateNavigator } from '../DateNavigator';
import { MealLog, MealType } from '../../types';
import { addDays, getDaysDifference, formatOrdinalDate } from '../../lib/calculations';

const MEAL_CATEGORY_CONFIG: Record<MealType, { label: string; icon: any }> = {
  breakfast: { label: 'BREAKFAST', icon: Sun },
  lunch: { label: 'LUNCH', icon: Utensils },
  dinner: { label: 'DINNER', icon: Soup },
  snack: { label: 'SNACKS', icon: Coffee },
};

export const NutritionScreen: React.FC = () => {
  const { 
    mealLogs, 
    nutritionSettings, 
    activeTodayDate,
    selectedDate,
    setSelectedDate,
    currentArc,
    isDateFuture,
    deleteMealLog,
    addMealLog,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Targets
  const calorieTarget = nutritionSettings?.caloriesTarget || 2200;
  const proteinTarget = nutritionSettings?.proteinTarget || 180;
  const carbsTarget = nutritionSettings?.carbsTarget || 210;
  const fatTarget = nutritionSettings?.fatTarget || 70;

  const isViewingToday = selectedDate === activeTodayDate;
  const isViewingYesterday = selectedDate === addDays(activeTodayDate, -1);
  const isTomorrow = selectedDate === addDays(activeTodayDate, 1);
  const isFuture = isDateFuture(selectedDate);

  // Day calculations relative to arc
  const arcDayNumber = useMemo(() => {
    if (!currentArc?.startDate) return 1;
    const diff = getDaysDifference(currentArc.startDate, selectedDate) + 1;
    return Math.max(1, diff);
  }, [currentArc?.startDate, selectedDate]);

  // Formatted date string with ordinal suffix
  const formattedDate = useMemo(() => {
    return formatOrdinalDate(selectedDate, { includeWeekday: true, shortMonth: true, omitYear: true });
  }, [selectedDate]);

  // Meals for the selected date (each date uses its own daily nutrition records)
  const dayMeals = useMemo(() => {
    return mealLogs.filter((m) => m.date === selectedDate);
  }, [mealLogs, selectedDate]);

  // Sum macros for current day
  const dayTotals = useMemo(() => {
    return dayMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fat: acc.fat + (m.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [dayMeals]);

  // Copy meal to today
  const handleCopyToToday = async (meal: MealLog) => {
    await addMealLog({
      date: activeTodayDate,
      name: meal.name,
      mealType: meal.mealType,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    });
  };

  // Group meals by category
  const categorizedMeals = useMemo(() => {
    const groups: Record<MealType, MealLog[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };
    dayMeals.forEach((m) => {
      if (groups[m.mealType]) {
        groups[m.mealType].push(m);
      } else {
        groups.snack.push(m);
      }
    });
    return groups;
  }, [dayMeals]);

  return (
    <div className="space-y-4 select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-2xl font-black text-[#0D1B2A] tracking-tight">
            Nutrition
          </h1>
          <p className="text-xs font-semibold text-[#68727D] mt-0.5">
            Calibrate fuel & daily macros
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Macro Targets"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#68727D] hover:text-[#0D1B2A] hover:bg-[#F2F1ED] transition-colors cursor-pointer"
          >
            <Target className="w-5 h-5 stroke-[1.9]" />
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[1.75]" />
            <span>Add Meal</span>
          </button>
        </div>
      </header>

      {/* Date Navigation (Consistent Reusable Component) */}
      <DateNavigator />

      {/* Look-Ahead View for Future Dates */}
      {isFuture && (
        <div className="bg-[#DCEAF4]/60 border border-[#4A90C2]/30 rounded-2xl p-3 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#12324A] tracking-wider uppercase">
            <span>LOOK-AHEAD VIEW — {isTomorrow ? 'TOMORROW' : formattedDate}</span>
          </div>
          <p className="text-[11px] text-[#68727D] font-medium">
            Plan ahead or preview targets for upcoming days.
          </p>
        </div>
      )}

      {/* Macros Overview: Calories, Protein, Carbs, Fat */}
      <section className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#68727D] uppercase tracking-wider">
            MACRO TARGETS
          </span>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="text-xs font-bold text-[#4A90C2] hover:underline cursor-pointer"
          >
            Edit Targets
          </button>
        </div>

        {(() => {
          const currentCal = dayTotals.calories;
          const currentProt = dayTotals.protein;
          const currentCarbs = dayTotals.carbs;
          const currentFat = dayTotals.fat;

          const getComparisonText = (actual: number, target: number, unit: string) => {
            const diff = target - actual;
            if (diff === 0) return 'Goal reached';
            if (diff > 0) return `${diff} ${unit} remaining`;
            return `${Math.abs(diff)} ${unit} over`;
          };

          const calComparison = getComparisonText(currentCal, calorieTarget, 'kcal');
          const protComparison = getComparisonText(currentProt, proteinTarget, 'g');
          const carbsComparison = getComparisonText(currentCarbs, carbsTarget, 'g');
          const fatComparison = getComparisonText(currentFat, fatTarget, 'g');

          return (
            <>
              {/* Calories Highlight */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#4A90C2]" />
                    <span className="text-xs font-bold text-[#0D1B2A]">Calories</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#0D1B2A]">
                      {currentCal} / {calorieTarget} kcal
                    </span>
                    <div className="text-[10px] font-semibold text-[#68727D]">
                      {calComparison}
                    </div>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-[#EEEDE9] overflow-hidden">
                  <div
                    className="h-full bg-[#4A90C2] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((currentCal / calorieTarget) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* 3 Macro Breakdown */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {/* Protein */}
                <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9] flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-[#68727D] uppercase">Protein</div>
                    <div className="text-sm font-black text-[#0D1B2A] mt-0.5">
                      {currentProt}g
                    </div>
                    <div className="text-[10px] text-[#68727D] font-medium">Target: {proteinTarget}g</div>
                  </div>
                  <div className="text-[10px] font-bold text-[#12324A] mt-1.5 pt-1 border-t border-[#EEEDE9]">
                    {protComparison}
                  </div>
                </div>

                {/* Carbs */}
                <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9] flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-[#68727D] uppercase">Carbs</div>
                    <div className="text-sm font-black text-[#0D1B2A] mt-0.5">
                      {currentCarbs}g
                    </div>
                    <div className="text-[10px] text-[#68727D] font-medium">Target: {carbsTarget}g</div>
                  </div>
                  <div className="text-[10px] font-bold text-[#12324A] mt-1.5 pt-1 border-t border-[#EEEDE9]">
                    {carbsComparison}
                  </div>
                </div>

                {/* Fat */}
                <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9] flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-[#68727D] uppercase">Fat</div>
                    <div className="text-sm font-black text-[#0D1B2A] mt-0.5">
                      {currentFat}g
                    </div>
                    <div className="text-[10px] text-[#68727D] font-medium">Target: {fatTarget}g</div>
                  </div>
                  <div className="text-[10px] font-bold text-[#12324A] mt-1.5 pt-1 border-t border-[#EEEDE9]">
                    {fatComparison}
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </section>

      {/* Meals List: Breakfast, Lunch, Dinner, Snacks */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black text-[#68727D] uppercase tracking-wider">
            LOGGED MEALS
          </span>
        </div>

        {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => {
          const config = MEAL_CATEGORY_CONFIG[type];
          const Icon = config.icon;
          const mealsInType = categorizedMeals[type];

          return (
            <div
              key={type}
              className="bg-white rounded-3xl p-4 border border-[#EEEDE9] shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-[#0D1B2A] tracking-wider uppercase">
                    {config.label}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-xs font-bold text-[#4A90C2] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log</span>
                </button>
              </div>

              {mealsInType.length === 0 ? (
                <div className="py-3 text-center text-xs font-medium text-[#68727D]/70 bg-[#F7F6F2] rounded-2xl border border-dashed border-[#EEEDE9]">
                  No {config.label.toLowerCase()} logged
                </div>
              ) : (
                <div className="space-y-2">
                  {mealsInType.map((meal) => (
                    <div
                      key={meal.id}
                      className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9] flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-black text-[#0D1B2A] truncate">
                          {meal.name}
                        </div>
                        <div className="text-[11px] font-semibold text-[#68727D] mt-0.5">
                          {meal.calories} cal · {meal.protein}P · {meal.carbs}C · {meal.fat}F
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {!isViewingToday && (
                          <button
                            type="button"
                            onClick={() => handleCopyToToday(meal)}
                            title="Copy to Today"
                            aria-label="Copy to Today"
                            className="p-1.5 rounded-lg text-[#68727D] hover:text-[#12324A] hover:bg-[#EEEDE9] transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteMealLog(meal.id)}
                          title="Delete meal"
                          aria-label="Delete meal"
                          className="p-1.5 rounded-lg text-[#68727D] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Meal Entry Modal */}
      <MealEntryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        targetDate={selectedDate}
      />

      {/* Nutrition Settings / Targets Modal */}
      <NutritionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
