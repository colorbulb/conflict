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
  const [editingLang, setEditingLang] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    setLocalColors(themeColors);
  }, [themeColors]);

  useEffect(() => {
    setLocalTrial(trialSettings);
  }, [trialSettings]);

  useEffect(() => {
    setLocalTranslations(translations);
  }, [translations]);

  const handleSaveTheme = () => {
    onUpdateTheme(localColors);
  };

  const handleSaveTrial = () => {
    onUpdateTrial(localTrial);
  };

  const handleSaveTranslations = () => {
    onUpdateTranslations(localTranslations);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Translations Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="bg-brand-blue p-1.5 rounded-lg text-white">
            <Palette className="w-5 h-5" />
          </div>
          Translations
        </h3>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setEditingLang('en')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              editingLang === 'en'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setEditingLang('zh')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              editingLang === 'zh'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            繁體中文
          </button>
        </div>

        {/* TODO: Add translation fields - extract from old CMSDashboard.tsx */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600">
            Translation editor placeholder - extract full implementation from old CMSDashboard.tsx
          </p>
        </div>

        <button
          onClick={handleSaveTranslations}
          className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
        >
          <Save className="w-5 h-5" /> Save Translations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Brand Colors */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="bg-brand-purple p-1.5 rounded-lg text-white">
              <Palette className="w-5 h-5" />
            </div>
            Theme Colors
          </h3>
          <div className="space-y-4">
            {Object.entries(localColors).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <label className="capitalize font-bold text-gray-600 text-sm">
                  Brand {key}
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                    {value}
                  </span>
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        setLocalColors({ ...localColors, [key]: e.target.value })
                      }
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer p-0 border-0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveTheme}
            className="mt-6 w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2"
          >
            <Save className="w-5 h-5" /> Save Theme
          </button>
        </div>

        {/* Free Trial Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
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

            {/* TODO: Add calendar grid - extract from old CMSDashboard.tsx */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Calendar implementation placeholder - extract full calendar from old CMSDashboard.tsx
              </p>
            </div>

            <button
              onClick={handleSaveTrial}
              className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Trial Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
