
import React from 'react';
import { NegotiatedAgreement } from '../types';
import { Icons } from '../constants';

interface Props {
  agreements: NegotiatedAgreement[];
  onNew: () => void;
}

const Vault: React.FC<Props> = ({ agreements, onNew }) => {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">The Vault</h2>
          <p className="text-sm text-slate-500">Your history of growth and resolution.</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700"
        >
          New Entry
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {agreements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4">
             <div className="opacity-20"><Icons.Vault /></div>
             <p className="text-sm font-medium">No archived treaties yet.</p>
          </div>
        ) : (
          agreements.map(agreement => (
            <div key={agreement.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-slate-400">
                  {new Date(agreement.timestamp).toLocaleDateString()}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase">
                  Resolved
                </span>
              </div>

              {/* Category Badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {agreement.categories?.map(cat => (
                  <span key={cat} className="flex items-center gap-1 text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                    <Icons.Tag />
                    {cat}
                  </span>
                ))}
              </div>

              <h4 className="text-sm font-bold text-slate-800 mb-2 truncate">"{agreement.summary}"</h4>
              
              <div className="space-y-1 mb-4">
                {agreement.commitments.slice(0, 2).map((c, i) => (
                  <p key={i} className="text-xs text-slate-500 truncate">• {c}</p>
                ))}
                {agreement.commitments.length > 2 && <p className="text-[10px] text-indigo-600">+{agreement.commitments.length - 2} more</p>}
              </div>

              <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] text-slate-400">Review: {new Date(agreement.reviewDate).toLocaleDateString()}</span>
                <button className="text-[10px] font-bold text-indigo-600 hover:underline">View Full Treaty</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl text-center">
        <p className="text-xs font-bold text-indigo-900 mb-1">Relationship Insight</p>
        <p className="text-[10px] text-indigo-700 leading-relaxed">
          You've resolved {agreements.length} conflicts this month. 
          {agreements.length > 0 
            ? " Your communication is most active in " + (agreements[0].categories[0] || "General") + " matters. Keep it up!" 
            : " Start your first resolution lab session to see patterns."}
        </p>
      </div>
    </div>
  );
};

export default Vault;
