import React, { useState, useEffect } from 'react';
import { Save, Languages } from 'lucide-react';
import { translations as initialTranslations } from '../../../translations';

type TranslationsType = typeof initialTranslations;

interface TranslationsEditorProps {
  translations: TranslationsType;
  onSave: (translations: TranslationsType) => void;
}

const TranslationsEditor: React.FC<TranslationsEditorProps> = ({ translations, onSave }) => {
  const [localTranslations, setLocalTranslations] = useState(translations);
  const [editingLang, setEditingLang] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    setLocalTranslations(translations);
  }, [translations]);

  const flattenTranslations = (obj: any, prefix = ''): Array<{ label: string; path: string; value: string }> => {
    const result: Array<{ label: string; path: string; value: string }> = [];
    for (const key in obj) {
      const newPath = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        result.push(...flattenTranslations(obj[key], newPath));
      } else if (typeof obj[key] === 'string') {
        result.push({ label: newPath, path: newPath, value: obj[key] });
      }
    }
    return result;
  };

  const updateTranslationValue = (path: string, value: string) => {
    const keys = path.split('.');
    const newTranslations = JSON.parse(JSON.stringify(localTranslations));
    let current: any = newTranslations[editingLang];
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setLocalTranslations(newTranslations);
  };

  const handleSave = () => {
    onSave(localTranslations);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="bg-brand-blue p-1.5 rounded-lg text-white">
          <Languages className="w-5 h-5" />
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
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {flattenTranslations(localTranslations[editingLang]).map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
          >
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
        onClick={handleSave}
        className="mt-6 w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
      >
        <Save className="w-5 h-5" /> Save Translations
      </button>
    </div>
  );
};

export default TranslationsEditor;