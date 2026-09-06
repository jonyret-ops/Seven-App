import React, { useState } from 'react';
import { X, Download, Upload, Trash2, Volume2, VolumeX, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { profile, currentArc, updateProfile, updateArc, resetAllData, exportData, importData } = useApp();

  const [name, setName] = useState(profile.name);
  const [dailyXpGoal, setDailyXpGoal] = useState(String(currentArc.dailyXpGoal));
  const [dailyStepGoal, setDailyStepGoal] = useState(String(currentArc.stepTarget));
  const [goalWeight, setGoalWeight] = useState(String(currentArc.goalWeight));
  const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>(profile.weightUnit || 'lb');
  const [trackWeight, setTrackWeight] = useState<boolean>(profile.trackWeight !== false);
  const [bodyMode, setBodyMode] = useState(profile.bodyMode || 'lose');
  const [soundEffects, setSoundEffects] = useState(profile.soundEffects);
  
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: name.trim() || 'Athlete',
      soundEffects,
      weightUnit,
      trackWeight,
      bodyMode,
    });
    await updateArc({
      dailyXpGoal: parseInt(dailyXpGoal, 10) || 100,
      stepTarget: parseInt(dailyStepGoal, 10) || 10000,
      goalWeight: parseFloat(goalWeight) || currentArc.goalWeight,
    });
    setStatusMessage('Settings saved successfully');
    setTimeout(() => {
      setStatusMessage('');
      onClose();
    }, 600);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#14171D] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 border border-white/[0.1] shadow-2xl text-white no-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Settings</h3>
            <p className="text-[11px] text-zinc-400">Configure SEVEN parameters & persistence</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                Daily XP Goal
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={dailyXpGoal}
                onChange={(e) => setDailyXpGoal(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                Step Target
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={dailyStepGoal}
                onChange={(e) => setDailyStepGoal(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Weight & Body Settings */}
          <div className="space-y-2.5 p-3 rounded-2xl bg-zinc-900/60 border border-white/[0.05]">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                Track Body Weight
              </label>
              <input
                type="checkbox"
                checked={trackWeight}
                onChange={(e) => setTrackWeight(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            {trackWeight && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">Unit</span>
                  <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setWeightUnit('lb')}
                      className={`px-2.5 py-0.5 rounded-md text-xs font-black transition-all cursor-pointer ${
                        weightUnit === 'lb' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      LB
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit('kg')}
                      className={`px-2.5 py-0.5 rounded-md text-xs font-black transition-all cursor-pointer ${
                        weightUnit === 'kg' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      KG
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                    Arc Goal Weight ({weightUnit.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </>
            )}
          </div>

          <div className="pt-1 flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-white/[0.05]">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
              {soundEffects ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
              <span>Sound Effects & Chimes</span>
            </div>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-xs transition-all cursor-pointer"
          >
            Save Settings
          </button>
        </form>

        {/* Data export / import and reset */}
        <div className="mt-5 pt-4 border-t border-zinc-800 space-y-3">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">
            App & Data Management
          </span>

          <PWAInstallButton variant="full" />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex-1 h-9 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-zinc-700 cursor-pointer"
            >
              {copiedExport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copiedExport ? 'Downloaded' : 'Export Data'}</span>
            </button>

            <label className="flex-1 h-9 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-zinc-700">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>

          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full h-9 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Data</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-center space-y-2">
              <p className="text-xs font-bold text-rose-300">
                Are you sure? This will wipe all logs permanently.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 h-8 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 h-8 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-500 cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
