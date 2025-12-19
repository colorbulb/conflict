
import React, { useState, useEffect } from 'react';
import { AppState, NegotiatedAgreement, Partner } from '../types';
import { geminiService } from '../services/geminiService';
import { auth } from '../services/firebase';
import { saveAgreementToFirestore } from '../services/resolutionService';

interface Props {
  state: AppState;
  onArchive: (agreement: NegotiatedAgreement) => void;
  pairId?: string | null;
}

const PeaceTreaty: React.FC<Props> = ({ state, onArchive, pairId = null }) => {
  const [loading, setLoading] = useState(true);
  const [treaty, setTreaty] = useState<any>(null);

  useEffect(() => {
    const fetchTreaty = async () => {
      const accepted = state.proposals.filter(p => p.status === 'Accepted');
      const data = await geminiService.generatePeaceTreaty(accepted, state.partnerBSummary);
      setTreaty(data);
      setLoading(false);
    };
    fetchTreaty();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Scribing your Peace Treaty...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in zoom-in duration-500 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-slate-800 border-b border-slate-200 pb-4 inline-block">
            {treaty?.title || "Digital Peace Treaty"}
          </h2>
        </div>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p className="text-slate-600 leading-relaxed text-sm italic">
            {treaty?.body}
          </p>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600">The Commitments</h4>
            <ul className="space-y-3">
              {treaty?.commitments.map((c: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                  <span className="text-indigo-600 font-bold">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-8 text-center">
            <div className="space-y-2">
              <div className="h-px bg-slate-300 w-full" />
              <p className="text-[10px] uppercase font-bold text-slate-400">Partner A signature</p>
            </div>
            <div className="space-y-2">
              <div className="h-px bg-slate-300 w-full" />
              <p className="text-[10px] uppercase font-bold text-slate-400">Partner B signature</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-indigo-50 p-4 rounded-xl flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-indigo-900">Check-in Scheduled</p>
              <p className="text-[10px] text-indigo-700">One week from today ({new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()})</p>
           </div>
           <div className="w-8 h-8 bg-indigo-200 rounded-lg flex items-center justify-center">
              📅
           </div>
        </div>

        <button 
          onClick={async () => {
            const agreement: NegotiatedAgreement = {
              id: Math.random().toString(),
              timestamp: new Date().toISOString(),
              summary: state.partnerBSummary,
              commitments: treaty?.commitments || [],
              reviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              participants: ['Partner A', 'Partner B'],
              categories: state.iStatement?.categories || []
            };

            try {
              const currentUser = auth.currentUser;
              const partnerRole: Partner | 'Both' = state.activePartner || 'Partner A';
              await saveAgreementToFirestore(
                agreement,
                {
                  ownerUid: currentUser ? currentUser.uid : null,
                  partnerRole: partnerRole === 'Partner A' || partnerRole === 'Partner B' ? partnerRole : 'Both',
                  pairId
                }
              );
            } catch (error) {
              console.error('Failed to save agreement to Firestore', error);
            }

            onArchive(agreement);
          }}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700"
        >
          Archive to The Vault
        </button>
      </div>
    </div>
  );
};

export default PeaceTreaty;
