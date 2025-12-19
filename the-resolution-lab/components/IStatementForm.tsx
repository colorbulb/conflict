
import React, { useState } from 'react';
import { IStatement } from '../types';
import { COMMON_SCENARIOS } from '../constants';
import { geminiService } from '../services/geminiService';
import { useResolutionTags } from '../hooks/useResolutionTags';

interface Props {
  onComplete: (stmt: IStatement) => void;
}

const IStatementForm: React.FC<Props> = ({ onComplete }) => {
  const { feelings, needs, categories } = useResolutionTags();
  const [form, setForm] = useState<IStatement>({
    feel: '',
    when: '',
    because: '',
    outcome: '',
    tags: [],
    categories: []
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const toggleCategory = (cat: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat]
    }));
  };

  const handleSubmit = async () => {
    setAnalyzing(true);
    const fullText = `I feel ${form.feel} when ${form.when} because I need ${form.because}. My ideal outcome is ${form.outcome}`;
    const analysis = await geminiService.analyzeIStatement(fullText);
    
    if (analysis?.isBlaming) {
      setSuggestion(analysis.suggestions);
      setAnalyzing(false);
    } else {
      onComplete(form);
    }
  };

  const getSuggestions = () => {
    return form.categories.flatMap(cat => COMMON_SCENARIOS[cat] || []).slice(0, 3);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Perspective Phase</h2>
        <p className="text-sm text-slate-500">Construct your thoughts clearly using "I" statements.</p>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-4">
        {/* Categories (Admin Managed) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">This dispute relates to:</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(tag => (
              <button 
                key={tag}
                onClick={() => toggleCategory(tag)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  form.categories.includes(tag) 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Feel */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">I feel...</label>
          <input 
            value={form.feel}
            onChange={(e) => setForm({...form, feel: e.target.value})}
            placeholder="e.g. overwhelmed, disconnected..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {feelings.map(tag => (
              <button 
                key={tag}
                onClick={() => setForm({...form, feel: tag})}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${form.feel === tag ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* When */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">When...</label>
          <textarea 
            value={form.when}
            onChange={(e) => setForm({...form, when: e.target.value})}
            placeholder="Describe the specific event without using 'You always...'"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 h-20 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />
          {getSuggestions().length > 0 && (
            <div className="space-y-1 pt-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Common Scenarios:</p>
              <div className="flex flex-wrap gap-2">
                {getSuggestions().map(sug => (
                  <button 
                    key={sug}
                    onClick={() => setForm({...form, when: sug})}
                    className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-100 text-left max-w-full truncate"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Because */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Because I need...</label>
          <input 
            value={form.because}
            onChange={(e) => setForm({...form, because: e.target.value})}
            placeholder="The underlying need (e.g. respect, validation)"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {needs.map(tag => (
              <button 
                key={tag}
                onClick={() => setForm({...form, because: tag})}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${form.because === tag ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Ideal Outcome */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">My ideal outcome is...</label>
          <input 
            value={form.outcome}
            onChange={(e) => setForm({...form, outcome: e.target.value})}
            placeholder="e.g. A shared schedule for household chores"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {suggestion && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
            <p className="text-sm text-rose-800 font-semibold mb-1">AI Mediator Suggestion:</p>
            <p className="text-xs text-rose-700 leading-relaxed italic">"{suggestion}"</p>
          </div>
        )}
      </div>

      <button
        disabled={analyzing || !form.feel || !form.when || !form.because || form.categories.length === 0}
        onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all mt-4"
      >
        {analyzing ? 'Mediating...' : 'Submit Statement'}
      </button>
    </div>
  );
};

export default IStatementForm;
