import React, { useState, useEffect } from 'react';
import { ThemeColors, TrialSettings } from '../../types';
import { Save, Palette, Calendar } from 'lucide-react';
import { translations as initialTranslations } from '../../translations';
import TranslationsEditor from './editors/TranslationsEditor';
import TrialCalendar from './settings/TrialCalendar';

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

  const handleSaveTheme = () => {
    onUpdateTheme(localColors);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Translations Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <TranslationsEditor
          translations={localTranslations}
          onSave={(trans) => {
            setLocalTranslations(trans);
            onUpdateTranslations(trans);
          }}
        />
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
          <TrialCalendar
            trialSettings={localTrial}
            onSave={(settings) => {
              setLocalTrial(settings);
              onUpdateTrial(settings);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
