
import React, { useState, useEffect } from 'react';
import { ResolutionPhase, AppState, Partner, Proposal } from './types';
import CoolingOff from './components/CoolingOff';
import IStatementForm from './components/IStatementForm';
import MirroringStep from './components/MirroringStep';
import NegotiationTable from './components/NegotiationTable';
import PeaceTreaty from './components/PeaceTreaty';
import Vault from './components/Vault';
import { Icons } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentPhase: ResolutionPhase.COOLING_OFF,
    activePartner: 'Partner A',
    frustrationLevel: 0,
    iStatement: null,
    partnerBSummary: '',
    summaryValidated: false,
    sliderA: { ideal: 4, min: 1 },
    sliderB: { ideal: 4, min: 1 },
    proposals: [],
    vault: []
  });

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const switchPartner = () => {
    updateState({ activePartner: state.activePartner === 'Partner A' ? 'Partner B' : 'Partner A' });
  };

  const renderPhase = () => {
    switch (state.currentPhase) {
      case ResolutionPhase.COOLING_OFF:
        return <CoolingOff onComplete={(level) => {
          updateState({ frustrationLevel: level, currentPhase: level < 8 ? ResolutionPhase.I_STATEMENT : ResolutionPhase.COOLING_OFF });
        }} />;
      case ResolutionPhase.I_STATEMENT:
        return <IStatementForm onComplete={(stmt) => {
          updateState({ iStatement: stmt, currentPhase: ResolutionPhase.MIRRORING, activePartner: 'Partner B' });
        }} />;
      case ResolutionPhase.MIRRORING:
        return <MirroringStep state={state} updateState={updateState} />;
      case ResolutionPhase.NEGOTIATION:
        return <NegotiationTable state={state} updateState={updateState} />;
      case ResolutionPhase.CONTRACT:
        return <PeaceTreaty state={state} onArchive={(agreement) => {
          updateState({ 
            vault: [agreement, ...state.vault], 
            currentPhase: ResolutionPhase.VAULT,
            iStatement: null,
            proposals: [],
            partnerBSummary: '',
            summaryValidated: false
          });
        }} />;
      case ResolutionPhase.VAULT:
        return <Vault agreements={state.vault} onNew={() => updateState({ currentPhase: ResolutionPhase.COOLING_OFF })} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Icons.HarmonyLogo />
        </div>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => updateState({ currentPhase: ResolutionPhase.VAULT })}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <Icons.Vault />
            <span className="text-sm font-medium">The Vault</span>
          </button>
          
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm">
            <span className={`text-xs font-bold uppercase tracking-wider ${state.activePartner === 'Partner A' ? 'text-blue-600' : 'text-rose-600'}`}>
              {state.activePartner}
            </span>
            <button 
              onClick={switchPartner}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              title="Simulate Switching Users"
            >
              <Icons.Switch />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 min-h-[500px] flex flex-col">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
          {Object.values(ResolutionPhase).filter(v => v !== ResolutionPhase.VAULT).map((phase, idx) => (
            <div 
              key={phase}
              className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-500 ${
                Object.values(ResolutionPhase).indexOf(state.currentPhase) >= idx 
                ? 'bg-indigo-600' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderPhase()}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-8 text-slate-400 text-sm">
        Structured conflict resolution for healthier relationships.
      </footer>
    </div>
  );
};

export default App;
