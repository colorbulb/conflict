// Stub file - Extract content from CMSDashboard.tsx lines ~3281-end
import React, { useState, useEffect } from 'react';
import { ThemeColors, TrialSettings } from '../../types';
import { Save, Palette, Calendar } from 'lucide-react';
import { translations as initialTranslations } from '../../translations';

type TranslationsType = typeof initialTranslations;

interface SettingsTabProps {
  themeColors: ThemeColors;
  trialSettings: TrialSettings;
  translations: TranslationsType;
  onUpdateTheme: (colors: ThemeColors) => void;
  onUpdateTrial: (settings: TrialSettings) => void;
  onUpdateTranslations: (translations: TranslationsType) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ 
  themeColors, 
  trialSettings, 
  translations,
  onUpdateTheme, 
  onUpdateTrial,
  onUpdateTranslations
}) => {
  const [localColors, setLocalColors] = useState<ThemeColors>(themeColors);
  const [localTrial, setLocalTrial] = useState<TrialSettings>(trialSettings);
  const [localTranslations, setLocalTranslations] = useState<TranslationsType>(translations);

  useEffect(() => {
    setLocalColors(themeColors);
  }, [themeColors]);

  useEffect(() => {
    setLocalTrial(trialSettings);
  }, [trialSettings]);

  useEffect(() => {
    setLocalTranslations(translations);
  }, [translations]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Global Settings</h2>
        
        {activeTab === 'settings' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Translations Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="bg-brand-blue p-1.5 rounded-lg text-white"><Languages className="w-5 h-5" /></div>
                        Translations
                    </h3>
                    <div className="mb-4 flex gap-2">
                        <button
                            onClick={() => setEditingLang('en')}
                            className={`px-4 py-2 rounded-lg font-bold transition-colors ${editingLang === 'en' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setEditingLang('zh')}
                            className={`px-4 py-2 rounded-lg font-bold transition-colors ${editingLang === 'zh' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            繁體中文
                        </button>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {flattenTranslations(localTranslations[editingLang]).map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                    {item.label}
                                </label>
                                <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => updateTranslationValue(item.path, e.target.value)}
                                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white focus:bg-white transition-colors"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSaveTranslations}
                        className="mt-6 w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                        <Save className="w-5 h-5" /> Save Translations
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Brand Colors */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="bg-brand-purple p-1.5 rounded-lg text-white"><Palette className="w-5 h-5" /></div>
                        Theme Colors
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(localColors).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <label className="capitalize font-bold text-gray-600 text-sm">Brand {key}</label>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">{value}</span>
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        <input 
                                            type="color" 
                                            value={value}
                                            onChange={(e) => setLocalColors({...localColors, [key]: e.target.value})}
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer p-0 border-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Free Trial Settings */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                     <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="bg-brand-orange p-1.5 rounded-lg text-white"><Calendar className="w-5 h-5" /></div>
                        Free Trial Calendar
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                            <span className="font-bold text-gray-700">Accepting Bookings</span>
                            <button 
                                onClick={() => setLocalTrial({...localTrial, enabled: !localTrial.enabled})}
                                className={`w-14 h-8 rounded-full transition-colors relative shadow-inner ${localTrial.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-all ${localTrial.enabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        
                        <div className={!localTrial.enabled ? 'opacity-50 pointer-events-none' : ''}>
                             <div className="flex justify-between items-center mb-3">
                                <div className="space-x-3">
                                    <button onClick={handleSelectAll} className="text-xs text-brand-blue font-bold hover:bg-blue-50 px-2 py-1 rounded transition-colors">Select All</button>
                                    <button onClick={handleDeselectAll} className="text-xs text-gray-500 hover:bg-gray-100 px-2 py-1 rounded transition-colors">Clear</button>
                                </div>
                                <span className="text-xs font-bold text-gray-400">{selectedDates.size} selected</span>
                             </div>

                             {/* Calendar Grid */}
                             <div className="grid grid-cols-7 gap-2 mb-4">
                                {['S','M','T','W','T','F','S'].map((d,i) => (
                                    <div key={i} className="text-center text-xs font-extrabold text-gray-300">{d}</div>
                                ))}
                                {calendarDays.map((date, idx) => {
                                    const dateStr = date.toISOString().split('T')[0];
                                    const isBlocked = (localTrial.blockedDates || []).includes(dateStr);
                                    const isSelected = selectedDates.has(dateStr);
                                    const hasCustom = localTrial.customAvailability && localTrial.customAvailability[dateStr];

                                    let bgClass = "bg-white text-gray-600 border-gray-100 hover:border-brand-blue/50";
                                    if (isBlocked) bgClass = "bg-red-50 text-red-300 border-red-100 decoration-red-300 line-through";
                                    else if (hasCustom) bgClass = "bg-blue-50 text-brand-blue border-blue-200 font-bold";
                                    else bgClass = "bg-green-50 text-green-600 border-green-100";

                                    return (
                                        <button 
                                            key={idx}
                                            onClick={(e) => toggleDateSelection(dateStr, e.ctrlKey || e.metaKey)}
                                            className={`aspect-square rounded-lg border flex items-center justify-center text-xs transition-all relative ${bgClass} ${isSelected ? 'ring-2 ring-brand-purple ring-offset-2 z-10 shadow-md transform scale-105' : ''}`}
                                            title={`${dateStr}`}
                                        >
                                            {date.getDate()}
                                            {hasCustom && !isBlocked && <div className="absolute bottom-1 w-1 h-1 bg-brand-blue rounded-full"></div>}
                                        </button>
                                    )
                                })}
                             </div>
                             
                             {/* Bulk Actions Bar */}
                             {selectedDates.size > 0 && (
                                 <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 animate-in fade-in slide-in-from-top-2 shadow-xl">
                                     <div className="flex gap-2 mb-4">
                                         <button onClick={handleBulkBlock} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                                             Block Selected
                                         </button>
                                         <button onClick={handleBulkAvailable} className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                                             Reset to Default
                                         </button>
                                     </div>
                                     
                                     <div>
                                         <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider flex items-center gap-2"><Clock className="w-3 h-3" /> Toggle Slots</h4>
                                         <div className="grid grid-cols-4 gap-2">
                                            {DEFAULT_TIME_SLOTS.map(slot => (
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
                    </div>
                </div>

                </div>

                <div className="mt-4">
                     <button 
                        onClick={handleSaveSettings}
                        className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                     >
                        <Save className="w-5 h-5" /> Save Global Settings
                     </button>
                </div>
             </div>
        )}
        
        <p className="text-gray-600">
          Extract settings content from CMSDashboard.tsx lines ~3281-end
        </p>
      </div>
    </div>
  );
};

export default SettingsTab;
