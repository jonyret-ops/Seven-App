import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mountain, Calendar, Target, Award, CheckCircle2, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDaysDifference } from '../lib/calculations';
import { Arc } from '../types';

interface ArcModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArcModal: React.FC<ArcModalProps> = ({ isOpen, onClose }) => {
  const { currentArc, updateArc, completeCurrentArc, arcRecaps, activeTodayDate, profile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [arcName, setArcName] = useState(currentArc.name);
  const [startDate, setStartDate] = useState(currentArc.startDate);
  const [endDate, setEndDate] = useState(currentArc.endDate);
  const [goalWeight, setGoalWeight] = useState(String(currentArc.goalWeight));
  const [recapJustGenerated, setRecapJustGenerated] = useState<boolean>(false);

  const totalDays = Math.max(1, getDaysDifference(currentArc.startDate, currentArc.endDate));
  const daysPassed = Math.max(1, Math.min(totalDays, getDaysDifference(currentArc.startDate, activeTodayDate) + 1));
  const daysLeft = Math.max(0, totalDays - daysPassed);

  const handleSave = async () => {
    await updateArc({
      name: arcName.trim() || currentArc.name,
      startDate: startDate || currentArc.startDate,
      endDate: endDate || currentArc.endDate,
      goalWeight: parseFloat(goalWeight) || currentArc.goalWeight,
    });
    setIsEditing(false);
  };

  const handleCompleteSeason = async () => {
    if (confirm('Are you sure you want to finish this Arc season? Your final stats and Grade card will be archived in Season History.')) {
      await completeCurrentArc();
      setRecapJustGenerated(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#14171D] border border-white/[0.1] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 text-white shadow-2xl space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Mountain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Arc Management</h3>
                  <p className="text-[11px] text-zinc-400">Progression seasons & historical recaps</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Season Info */}
            <div className="bg-[#181C23] p-4 rounded-2xl border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400">
                    CURRENT PROGRESSION ARC
                  </span>
                  <h4 className="text-lg font-black text-white">{currentArc.name}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                >
                  {isEditing ? 'Cancel' : 'Edit Arc'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400">Arc Title</label>
                    <input
                      type="text"
                      value={arcName}
                      onChange={(e) => setArcName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-400">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-400">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400">
                      Goal Weight ({profile.weightUnit || 'lb'})
                    </label>
                    <input
                      type="number"
                      value={goalWeight}
                      onChange={(e) => setGoalWeight(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-zinc-800">
                  <div className="bg-zinc-900/80 p-2 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Elapsed</span>
                    <span className="text-base font-black text-white">{daysPassed} d</span>
                  </div>
                  <div className="bg-zinc-900/80 p-2 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Remaining</span>
                    <span className="text-base font-black text-emerald-400">{daysLeft} d</span>
                  </div>
                  <div className="bg-zinc-900/80 p-2 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Total</span>
                    <span className="text-base font-black text-white">{totalDays} d</span>
                  </div>
                </div>
              )}
            </div>

            {/* Complete Season Action */}
            <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300">
                Season Completion & Archival
              </h4>
              <p className="text-[11px] text-zinc-400">
                When you finish an Arc, your character level, total XP, and achievements carry over continuously into your lifetime profile.
              </p>
              <button
                type="button"
                onClick={handleCompleteSeason}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/30 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Arc & Generate Recap Card</span>
              </button>
            </div>

            {/* Past Arc Recaps / Seasons */}
            {arcRecaps.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block">
                  PAST ARC RECAPS ({arcRecaps.length})
                </span>
                {arcRecaps.map((recap, idx) => (
                  <div key={idx} className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-black text-white">{recap.arcName}</h5>
                      <p className="text-[11px] text-zinc-400">
                        {recap.totalDays} Days • {recap.daysConquered} Conquered • -{recap.weightLost} lb
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
                        Grade {recap.finalGrade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
