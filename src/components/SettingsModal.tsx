import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Check, 
  Calendar, 
  Target,
  Flame,
  Dumbbell,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { DAYS_OF_WEEK_LIST, DEFAULT_WEEKLY_SCHEDULE } from '../constants';
import { DayOfWeek } from '../types';
import { ProfileIcon } from './ProfileIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    profile, 
    currentArc, 
    nutritionSettings,
    updateProfile, 
    updateArc, 
    updateNutritionSettings,
    resetAllData, 
    exportData, 
    importData 
  } = useApp();

  const [name, setName] = useState(profile.name || '');
  const [arcTitle, setArcTitle] = useState(currentArc.name || '');
  const [dailyStepGoal, setDailyStepGoal] = useState(String(currentArc.stepTarget || 10000));
  const [goalWeight, setGoalWeight] = useState(String(currentArc.goalWeight || 205));
  const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>(profile.weightUnit || 'lb');
  const [trackWeight, setTrackWeight] = useState<boolean>(profile.trackWeight !== false);
  const [bodyMode, setBodyMode] = useState(profile.bodyMode || 'lose');
  const [soundEffects, setSoundEffects] = useState(profile.soundEffects ?? true);
  const [weeklySchedule, setWeeklySchedule] = useState<Record<DayOfWeek, 'active' | 'rest'>>(
    profile.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE
  );

  // Sync with current props when opened
  useEffect(() => {
    if (isOpen) {
      setName(profile.name || '');
      setArcTitle(currentArc.name || '');
      setDailyStepGoal(String(currentArc.stepTarget || 10000));
    }
  }, [isOpen, profile.name, currentArc.name, currentArc.stepTarget]);

  // Nutrition / Macro Manual Targets (Requirements 21, 22, 23)
  const [caloriesTarget, setCaloriesTarget] = useState(String(nutritionSettings?.caloriesTarget || 2200));
  const [proteinTarget, setProteinTarget] = useState(String(nutritionSettings?.proteinTarget || 180));
  const [carbsTarget, setCarbsTarget] = useState(String(nutritionSettings?.carbsTarget || 210));
  const [fatTarget, setFatTarget] = useState(String(nutritionSettings?.fatTarget || 70));
  
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleToggleScheduleDay = async (day: DayOfWeek, status: 'active' | 'rest') => {
    const updated = {
      ...weeklySchedule,
      [day]: status,
    };
    setWeeklySchedule(updated);
    await updateProfile({ weeklySchedule: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: name.trim() || profile.name || '',
      soundEffects,
      weightUnit,
      trackWeight,
      bodyMode,
      weeklySchedule,
    });
    await updateArc({
      name: arcTitle.trim() || currentArc.name || 'Arc 1',
      dailyXpGoal: 100,
      stepTarget: parseInt(dailyStepGoal, 10) || 10000,
      goalWeight: parseFloat(goalWeight) || currentArc.goalWeight,
    });
    await updateNutritionSettings({
      caloriesTarget: parseInt(caloriesTarget, 10) || 2200,
      proteinTarget: parseInt(proteinTarget, 10) || 180,
      carbsTarget: parseInt(carbsTarget, 10) || 210,
      fatTarget: parseInt(fatTarget, 10) || 70,
    });

    setStatusMessage('Settings saved successfully');
    setTimeout(() => {
      setStatusMessage('');
      onClose();
    }, 500);
  };

  const handleExport = async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seven-discipline-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = await importData(content);
        if (success) {
          setStatusMessage('Data imported successfully!');
          setTimeout(() => onClose(), 1000);
        } else {
          setStatusMessage('Import failed. Invalid file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    await resetAllData();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-[#F7F6F2] rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto border border-[#EEEDE9] shadow-2xl text-[#0D1B2A] no-scrollbar">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-[#F7F6F2]/95 backdrop-blur-md p-4 border-b border-[#EEEDE9] flex items-center justify-between z-10">
          <div>
            <h2 className="text-base font-black text-[#0D1B2A] tracking-tight">
              Settings & Targets
            </h2>
            <p className="text-[11px] text-[#68727D] font-medium">
              Configure parameters, manual targets & backup
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-[#EEEDE9] hover:bg-[#EEEDE9] flex items-center justify-center text-[#68727D] hover:text-[#0D1B2A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {statusMessage && (
            <div className="p-3 rounded-2xl bg-[#DCEAF4] text-[#12324A] text-xs font-black border border-[#4A90C2]/30 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* 1. Identity & Goals */}
            <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3.5">
              <span className="text-[10px] font-black text-[#68727D] uppercase tracking-wider block">
                PROFILE & DISCIPLINE
              </span>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9] flex items-center justify-center shrink-0 shadow-xs">
                  <ProfileIcon size="md" />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-11 px-3.5 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl text-xs font-bold text-[#0D1B2A] focus:outline-none focus:border-[#4A90C2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                    Current Arc Title
                  </label>
                  <input
                    type="text"
                    value={arcTitle}
                    onChange={(e) => setArcTitle(e.target.value)}
                    placeholder="e.g. Arc 1, Winter Arc"
                    className="w-full h-11 px-3.5 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl text-xs font-bold text-[#0D1B2A] focus:outline-none focus:border-[#4A90C2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                    Daily Step Target
                  </label>
                  <input
                    type="number"
                    value={dailyStepGoal}
                    onChange={(e) => setDailyStepGoal(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl text-xs font-bold text-[#0D1B2A] focus:outline-none focus:border-[#4A90C2]"
                  />
                </div>
              </div>
            </div>

            {/* 2. MANUAL MACRO TARGETS (Requirements 21, 22, 23) */}
            <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#68727D] uppercase tracking-wider">
                  NUTRITION & MACRO TARGETS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#DCEAF4] text-[#12324A] text-[9px] font-black uppercase">
                  Manual Entry
                </span>
              </div>

              <p className="text-xs text-[#68727D] font-medium leading-relaxed">
                Manually specify your exact daily targets. SEVEN tracks against these values without automated recalculation.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={caloriesTarget}
                    onChange={(e) => setCaloriesTarget(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl text-xs font-bold text-[#0D1B2A] focus:outline-none focus:border-[#4A90C2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={proteinTarget}
                    onChange={(e) => setProteinTarget(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl text-xs font-bold text-[#0D1B2A] focus:outline-none focus:border-[#4A90C2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                    Carbohydrates (g)
                  </label>
                  <input
                    type="number"
                    value={carbsTarget}
                    onChange={(e) => setCarbsTarget(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl text-xs font-bold text-[#0D1B2A] focus:outline-none focus:border-[#4A90C2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    value={fatTarget}
                    onChange={(e) => setFatTarget(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl text-xs font-bold text-[#0D1B2A] focus:outline-none focus:border-[#4A90C2]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Body & Weight Target */}
            <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3.5">
              <span className="text-[10px] font-black text-[#68727D] uppercase tracking-wider block">
                BODY & WEIGHT
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                    Goal Weight
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl text-xs font-bold text-[#0D1B2A] focus:outline-none focus:border-[#4A90C2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                    Weight Unit
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 h-11 p-1 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setWeightUnit('lb')}
                      className={`rounded-lg text-xs font-black transition-all cursor-pointer ${
                        weightUnit === 'lb' ? 'bg-[#12324A] text-white shadow-xs' : 'text-[#68727D]'
                      }`}
                    >
                      LB
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit('kg')}
                      className={`rounded-lg text-xs font-black transition-all cursor-pointer ${
                        weightUnit === 'kg' ? 'bg-[#12324A] text-white shadow-xs' : 'text-[#68727D]'
                      }`}
                    >
                      KG
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#68727D] uppercase mb-1">
                  Body Objective Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'lose', label: 'Cut / Lose' },
                    { id: 'maintain', label: 'Maintain' },
                    { id: 'gain', label: 'Bulk / Gain' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setBodyMode(mode.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        bodyMode === mode.id
                          ? 'bg-[#12324A] text-white border-[#12324A]'
                          : 'bg-[#F7F6F2] text-[#68727D] border-[#EEEDE9]'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Weekly Active Schedule */}
            <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3.5">
              <span className="text-[10px] font-black text-[#68727D] uppercase tracking-wider block">
                WEEKLY SCHEDULE (GYM / REST)
              </span>

              <div className="grid grid-cols-7 gap-1">
                {DAYS_OF_WEEK_LIST.map((item) => {
                  const status = weeklySchedule[item.key] || 'active';
                  const isActive = status === 'active';
                  const shortDay = item.short.toUpperCase();

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleToggleScheduleDay(item.key, isActive ? 'rest' : 'active')}
                      className={`flex flex-col items-center py-2 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#12324A] text-white border-[#12324A]'
                          : 'bg-[#F7F6F2] text-[#68727D] border-[#EEEDE9]'
                      }`}
                    >
                      <span className="text-[9px] font-bold">{shortDay}</span>
                      <span className="text-[10px] font-black mt-0.5">
                        {isActive ? 'ACT' : 'RST'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Sound & System */}
            <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-[#0D1B2A]">
                  Audio & Completion Chimes
                </div>
                <div className="text-[11px] text-[#68727D]">
                  Tactile feedback upon quest execution
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSoundEffects(!soundEffects)}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  soundEffects ? 'bg-[#12324A]' : 'bg-[#EEEDE9]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEffects ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-black tracking-wider uppercase transition-all shadow-xs cursor-pointer min-h-[44px]"
            >
              Save Configuration
            </button>
          </form>

          {/* 6. Data Management & Backup */}
          <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3">
            <span className="text-[10px] font-black text-[#68727D] uppercase tracking-wider block">
              DATA BACKUP & PERSISTENCE
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleExport}
                className="py-2.5 px-3 rounded-xl border border-[#EEEDE9] bg-[#F7F6F2] hover:bg-[#EEEDE9] text-[#12324A] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{copiedExport ? 'Downloaded' : 'Export JSON'}</span>
              </button>

              <label className="py-2.5 px-3 rounded-xl border border-[#EEEDE9] bg-[#F7F6F2] hover:bg-[#EEEDE9] text-[#12324A] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset All Data */}
            <div className="pt-2 border-t border-[#EEEDE9]">
              {!showConfirmReset ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(true)}
                  className="w-full py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset App Data</span>
                </button>
              ) : (
                <div className="p-3 bg-red-50 rounded-2xl border border-red-200 space-y-2 text-center">
                  <div className="text-xs font-bold text-red-700">
                    Are you sure? This will wipe your local logs and reset to default.
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmReset(false)}
                      className="py-1.5 rounded-lg bg-white border border-red-200 text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="py-1.5 rounded-lg bg-red-600 text-white text-xs font-black cursor-pointer"
                    >
                      Confirm Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PWA Button */}
          <div className="pt-1">
            <PWAInstallButton />
          </div>
        </div>
      </div>
    </div>
  );
};
