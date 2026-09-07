import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BODY_MEASUREMENT_TYPES } from '../constants';
import { BodyMeasurementType } from '../types';

interface BodyMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BodyMeasurementModal: React.FC<BodyMeasurementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addBodyMeasurement, activeTodayDate } = useApp();

  const [selectedType, setSelectedType] = useState<BodyMeasurementType>('waist');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [date, setDate] = useState(activeTodayDate);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return;

    await addBodyMeasurement(selectedType, num, unit, date, note.trim() || undefined);
    setValue('');
    setNote('');
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
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Log Measurement</h2>
            <p className="text-xs text-slate-400 font-medium">Circumference & physical tracking</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Measurement Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Body Location
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BODY_MEASUREMENT_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.type}
                  onClick={() => setSelectedType(t.type)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                    selectedType === t.type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Value & Unit */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Value
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="32.5"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Unit
              </label>
              <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setUnit('in')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    unit === 'in' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'
                  }`}
                >
                  in
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    unit === 'cm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'
                  }`}
                >
                  cm
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#111827] hover:bg-black text-white font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            Save Measurement
          </button>
        </form>
      </div>
    </div>
  );
};
