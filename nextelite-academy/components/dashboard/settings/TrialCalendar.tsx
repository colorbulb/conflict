import React, { useState, useEffect } from 'react';
import { TrialSettings } from '../../../types';
import { DEFAULT_TIME_SLOTS } from '../../../constants';
import { Calendar, Clock, Save } from 'lucide-react';

interface TrialCalendarProps {
  trialSettings: TrialSettings;
  onSave: (settings: TrialSettings) => void;
}

const TrialCalendar: React.FC<TrialCalendarProps> = ({ trialSettings, onSave }) => {
  const [localTrial, setLocalTrial] = useState(trialSettings);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    setLocalTrial(trialSettings);
  }, [trialSettings]);

  useEffect(() => {
    // Generate calendar days for next 60 days
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    setCalendarDays(days);
  }, []);

  const toggleDateSelection = (dateStr: string, multiSelect: boolean) => {
    const newSelected = new Set(selectedDates);
    if (multiSelect) {
      if (newSelected.has(dateStr)) {
        newSelected.delete(dateStr);
      } else {
        newSelected.add(dateStr);
      }
    } else {
      newSelected.clear();
      newSelected.add(dateStr);
    }
    setSelectedDates(newSelected);
  };

  const handleSelectAll = () => {
    const allDates = new Set(calendarDays.map((d) => d.toISOString().split('T')[0]));
    setSelectedDates(allDates);
  };

  const handleDeselectAll = () => {
    setSelectedDates(new Set());
  };

  const handleBulkBlock = () => {
    const newBlocked = [...(localTrial.blockedDates || [])];
    selectedDates.forEach((date) => {
      if (!newBlocked.includes(date)) {
        newBlocked.push(date);
      }
    });
    setLocalTrial({ ...localTrial, blockedDates: newBlocked });
    setSelectedDates(new Set());
  };

  const handleBulkAvailable = () => {
    const newBlocked = (localTrial.blockedDates || []).filter((d) => !selectedDates.has(d));
    const newCustom = { ...localTrial.customAvailability };
    selectedDates.forEach((date) => {
      delete newCustom[date];
    });
    setLocalTrial({ ...localTrial, blockedDates: newBlocked, customAvailability: newCustom });
    setSelectedDates(new Set());
  };

  const toggleTimeSlotForSelected = (slot: string) => {
    const newCustom = { ...localTrial.customAvailability };
    selectedDates.forEach((date) => {
      if (!newCustom[date]) {
        newCustom[date] = { slots: [...DEFAULT_TIME_SLOTS] };
      }
      const slots = newCustom[date].slots || [];
      if (slots.includes(slot)) {
        newCustom[date].slots = slots.filter((s) => s !== slot);
      } else {
        newCustom[date].slots = [...slots, slot];
      }
    });
    setLocalTrial({ ...localTrial, customAvailability: newCustom });
  };

  const handleSave = () => {
    onSave(localTrial);
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="bg-brand-orange p-1.5 rounded-lg text-white">
          <Calendar className="w-5 h-5" />
        </div>
        Free Trial Calendar
      </h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
          <span className="font-bold text-gray-700">Accepting Bookings</span>
          <button
            onClick={() => setLocalTrial({ ...localTrial, enabled: !localTrial.enabled })}
            className={`w-14 h-8 rounded-full transition-colors relative shadow-inner ${
              localTrial.enabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-all ${
                localTrial.enabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className={!localTrial.enabled ? 'opacity-50 pointer-events-none' : ''}>
          <div className="flex justify-between items-center mb-3">
            <div className="space-x-3">
              <button
                onClick={handleSelectAll}
                className="text-xs text-brand-blue font-bold hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="text-xs text-gray-500 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
              >
                Clear
              </button>
            </div>
            <span className="text-xs font-bold text-gray-400">{selectedDates.size} selected</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center text-xs font-extrabold text-gray-300">
                {d}
              </div>
            ))}
            {calendarDays.map((date, idx) => {
              const dateStr = date.toISOString().split('T')[0];
              const isBlocked = (localTrial.blockedDates || []).includes(dateStr);
              const isSelected = selectedDates.has(dateStr);
              const hasCustom =
                localTrial.customAvailability && localTrial.customAvailability[dateStr];

              let bgClass = 'bg-white text-gray-600 border-gray-100 hover:border-brand-blue/50';
              if (isBlocked)
                bgClass = 'bg-red-50 text-red-300 border-red-100 decoration-red-300 line-through';
              else if (hasCustom) bgClass = 'bg-blue-50 text-brand-blue border-blue-200 font-bold';
              else bgClass = 'bg-green-50 text-green-600 border-green-100';

              return (
                <button
                  key={idx}
                  onClick={(e) => toggleDateSelection(dateStr, e.ctrlKey || e.metaKey)}
                  className={`aspect-square rounded-lg border flex items-center justify-center text-xs transition-all relative ${bgClass} ${
                    isSelected
                      ? 'ring-2 ring-brand-purple ring-offset-2 z-10 shadow-md transform scale-105'
                      : ''
                  }`}
                  title={`${dateStr}`}
                >
                  {date.getDate()}
                  {hasCustom && !isBlocked && (
                    <div className="absolute bottom-1 w-1 h-1 bg-brand-blue rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bulk Actions Bar */}
          {selectedDates.size > 0 && (
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 animate-in fade-in slide-in-from-top-2 shadow-xl">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleBulkBlock}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                >
                  Block Selected
                </button>
                <button
                  onClick={handleBulkAvailable}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                >
                  Reset to Default
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Toggle Slots
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {DEFAULT_TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => toggleTimeSlotForSelected(slot)}
                      className="text-[10px] font-bold py-1.5 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2 shadow-lg transition-all"
        >
          <Save className="w-5 h-5" /> Save Calendar
        </button>
      </div>
    </div>
  );
};

export default TrialCalendar;