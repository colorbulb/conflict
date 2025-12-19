
import React, { useState } from 'react';
import { AppState, ResolutionPhase, Proposal } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

const NegotiationTable: React.FC<Props> = ({ state, updateState }) => {
  const [newProp, setNewProp] = useState({ iWill: '', ifYou: '', importance: 'Medium' as any });

  const addProposal = () => {
    const proposal: Proposal = {
      id: Math.random().toString(36).substr(2, 9),
      from: state.activePartner,
      iWill: newProp.iWill,
      ifYou: newProp.ifYou,
      importance: newProp.importance,
      status: 'Pending'
    };
    updateState({ proposals: [...state.proposals, proposal] });
    setNewProp({ iWill: '', ifYou: '', importance: 'Medium' });
  };

  const updateProposalStatus = (id: string, status: Proposal['status']) => {
    updateState({
      proposals: state.proposals.map(p => p.id === id ? { ...p, status } : p)
    });
  };

  const getSliderColor = (val: number) => {
    if (val < 3) return 'bg-rose-500';
    if (val < 5) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">The Negotiation Table</h2>
        <p className="text-sm text-slate-500">Visualizing trade-offs and finding common ground.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2">
        {/* Sliders for Frequency */}
        <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Frequency Slider</h3>
          <p className="text-xs text-slate-500 italic mb-4">"How often should this happen?" (Scale: 1-7 times per week)</p>
          
          <div className="space-y-8">
            {/* Slider A */}
            <div className={`space-y-2 p-3 rounded-xl transition-all ${state.activePartner === 'Partner A' ? 'ring-2 ring-indigo-500 bg-white shadow-sm' : 'opacity-60'}`}>
              <div className="flex justify-between text-xs font-bold text-blue-600 uppercase">
                <span>Partner A</span>
                <span>Ideal: {state.sliderA.ideal} / Min: {state.sliderA.min}</span>
              </div>
              <input 
                type="range" min="0" max="7" 
                value={state.sliderA.ideal}
                disabled={state.activePartner !== 'Partner A'}
                onChange={(e) => updateState({ sliderA: { ...state.sliderA, ideal: parseInt(e.target.value) } })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider B */}
            <div className={`space-y-2 p-3 rounded-xl transition-all ${state.activePartner === 'Partner B' ? 'ring-2 ring-indigo-500 bg-white shadow-sm' : 'opacity-60'}`}>
              <div className="flex justify-between text-xs font-bold text-rose-600 uppercase">
                <span>Partner B</span>
                <span>Ideal: {state.sliderB.ideal} / Min: {state.sliderB.min}</span>
              </div>
              <input 
                type="range" min="0" max="7" 
                value={state.sliderB.ideal}
                disabled={state.activePartner !== 'Partner B'}
                onChange={(e) => updateState({ sliderB: { ...state.sliderB, ideal: parseInt(e.target.value) } })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
            </div>
          </div>
          
          {/* Overlap Visualizer */}
          <div className="h-4 bg-slate-200 rounded-full relative overflow-hidden flex">
            <div 
              className="h-full bg-indigo-200 opacity-50" 
              style={{ width: `${(Math.min(state.sliderA.ideal, state.sliderB.ideal) / 7) * 100}%` }}
            />
          </div>
          <p className="text-center text-[10px] text-slate-400">Highlighted: Shared Comfort Zone</p>
        </div>

        {/* Give-and-Take Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Proposals</h3>
          
          <div className="space-y-3">
            {state.proposals.map(p => (
              <div key={p.id} className={`p-4 rounded-2xl border ${p.status === 'Accepted' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200'} transition-all`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${p.from === 'Partner A' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                    {p.from}'s Offer
                  </span>
                  <span className={`text-[10px] font-bold ${p.importance === 'High' ? 'text-rose-500' : 'text-slate-400'}`}>
                    {p.importance} Priority
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="font-semibold text-slate-500">I will:</span> {p.iWill}</p>
                  <p><span className="font-semibold text-slate-500">If you:</span> {p.ifYou}</p>
                </div>
                
                {p.status === 'Pending' && p.from !== state.activePartner && (
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => updateProposalStatus(p.id, 'Accepted')}
                      className="flex-1 text-xs font-bold py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => updateProposalStatus(p.id, 'Counter')}
                      className="flex-1 text-xs font-bold py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                    >
                      Counter
                    </button>
                  </div>
                )}
                {p.status === 'Accepted' && (
                  <div className="mt-2 text-center">
                    <span className="text-xs font-bold text-emerald-600">✓ Agreement Reached</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* New Proposal Form */}
          <div className="bg-indigo-50 p-6 rounded-2xl space-y-4 border border-indigo-100">
             <h4 className="text-xs font-bold text-indigo-400 uppercase">Make a Proposal</h4>
             <div className="space-y-3">
               <input 
                  value={newProp.iWill}
                  onChange={e => setNewProp({...newProp, iWill: e.target.value})}
                  placeholder="I will..."
                  className="w-full text-sm border-none bg-white rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
               />
               <input 
                  value={newProp.ifYou}
                  onChange={e => setNewProp({...newProp, ifYou: e.target.value})}
                  placeholder="If you..."
                  className="w-full text-sm border-none bg-white rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
               />
               <div className="flex gap-2">
                 {['Low', 'Medium', 'High'].map(imp => (
                   <button
                    key={imp}
                    onClick={() => setNewProp({...newProp, importance: imp as any})}
                    className={`flex-1 text-[10px] py-1 rounded-md font-bold transition-colors ${newProp.importance === imp ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}
                   >
                     {imp}
                   </button>
                 ))}
               </div>
               <button 
                onClick={addProposal}
                className="w-full bg-indigo-600 text-white text-xs font-bold py-3 rounded-xl shadow-md hover:bg-indigo-700"
               >
                 Place on Table
               </button>
             </div>
          </div>
        </div>
      </div>

      <button
        disabled={state.proposals.filter(p => p.status === 'Accepted').length === 0}
        onClick={() => updateState({ currentPhase: ResolutionPhase.CONTRACT })}
        className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-all"
      >
        Draft Peace Treaty
      </button>
    </div>
  );
};

export default NegotiationTable;
