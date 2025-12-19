
import React, { useState } from 'react';
import { AppState, ResolutionPhase } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

const MirroringStep: React.FC<Props> = ({ state, updateState }) => {
  const [agreedToMirror, setAgreedToMirror] = useState(false);

  const handleSummarySubmit = () => {
    updateState({ activePartner: 'Partner A' });
  };

  const handleValidation = (valid: boolean) => {
    if (valid) {
      updateState({ currentPhase: ResolutionPhase.NEGOTIATION, summaryValidated: true });
    } else {
      updateState({ activePartner: 'Partner B', partnerBSummary: '' });
      setAgreedToMirror(true);
    }
  };

  // Partner B's Turn: Read and Summarize
  if (state.activePartner === 'Partner B') {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">The Mirror Step</h2>
          <p className="text-sm text-slate-500">Listening is the first step to resolution.</p>
        </div>

        {!agreedToMirror ? (
          <div className="bg-indigo-50 p-6 rounded-2xl text-center space-y-4">
            <p className="text-indigo-900 font-medium">Partner A has shared their perspective.</p>
            <p className="text-sm text-indigo-700">Before reading, do you agree to listen with an open mind and summarize their core concern back to them?</p>
            <button 
              onClick={() => setAgreedToMirror(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700"
            >
              I agree to summarize
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-xs uppercase font-bold text-slate-400 mb-2">Partner A's Entry:</p>
              <div className="text-slate-800 space-y-2 italic">
                <p>"I feel <strong>{state.iStatement?.feel}</strong>..."</p>
                <p>"When <strong>{state.iStatement?.when}</strong>..."</p>
                <p>"Because I need <strong>{state.iStatement?.because}</strong>."</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Summarize back what you heard:</label>
              <textarea 
                value={state.partnerBSummary}
                onChange={(e) => updateState({ partnerBSummary: e.target.value })}
                placeholder="I hear that you feel... because..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            <button
              disabled={!state.partnerBSummary}
              onClick={handleSummarySubmit}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg"
            >
              Send Summary to Partner A
            </button>
          </div>
        )}
      </div>
    );
  }

  // Partner A's Turn: Validate
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Validation Check</h2>
        <p className="text-sm text-slate-500">Does Partner B's summary reflect your true concern?</p>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <p className="text-xs uppercase font-bold text-indigo-400 mb-2">Partner B's Understanding:</p>
        <p className="text-indigo-900 font-medium italic">"{state.partnerBSummary}"</p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => handleValidation(false)}
          className="flex-1 bg-white border border-rose-200 text-rose-600 py-4 rounded-2xl font-bold hover:bg-rose-50"
        >
          No, let's try again
        </button>
        <button 
          onClick={() => handleValidation(true)}
          className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 shadow-lg"
        >
          Yes, that's it
        </button>
      </div>
    </div>
  );
};

export default MirroringStep;
