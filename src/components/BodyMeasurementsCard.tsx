import React, { useState } from 'react';
import { Ruler, Plus, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BodyMeasurementModal } from './BodyMeasurementModal';

export const BodyMeasurementsCard: React.FC = () => {
  const { bodyMeasurementSummaries } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
            <Ruler className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0D1B2A]">
              Body Composition
            </h3>
            <p className="text-[11px] text-[#68727D] font-medium">Circumference & metrics</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 rounded-full bg-[#DCEAF4] hover:bg-[#D0E2EE] text-[#12324A] text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2]" />
          <span>Log Metric</span>
        </button>
      </div>

      {bodyMeasurementSummaries.length === 0 ? (
        <div className="py-5 text-center text-xs text-[#68727D] border border-dashed border-[#EEEDE9] rounded-2xl bg-[#F7F6F2]">
          Tap "Log Metric" to track waist, chest, arms, and thighs.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {bodyMeasurementSummaries.map((summary) => {
            const hasChange = summary.change !== null && summary.change !== 0;
            const isPositive = (summary.change || 0) > 0;

            return (
              <div
                key={summary.type}
                className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9] hover:border-[#4A90C2] transition-all"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-[#68727D] mb-1 truncate">
                  <span className="truncate">{summary.label}</span>
                  {hasChange ? (
                    <span
                      className={`text-[10px] font-black flex items-center ${
                        isPositive ? 'text-[#0D1B2A]' : 'text-[#4A90C2]'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3 stroke-[2]" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 stroke-[2]" />
                      )}
                      {Math.abs(summary.change!)}
                    </span>
                  ) : (
                    <Minus className="w-3 h-3 text-[#68727D]/40 stroke-[2]" />
                  )}
                </div>

                <div className="text-base font-black text-[#0D1B2A]">
                  {summary.latestValue !== null && summary.latestValue !== undefined ? summary.latestValue : '—'}{' '}
                  {summary.latestValue !== null && summary.latestValue !== undefined && (
                    <span className="text-[10px] font-bold text-[#68727D]">
                      {summary.unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BodyMeasurementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
