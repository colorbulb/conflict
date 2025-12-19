import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { StoredAgreement } from '../services/resolutionService';

interface AdminUserDoc {
  isAdmin?: boolean;
}

interface ResolutionPairRow {
  id: string;
  partnerAEmail: string | null;
  partnerBEmail: string;
}

interface AgreementRow extends StoredAgreement {
  id: string;
}

const AdminVault: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pairs, setPairs] = useState<ResolutionPairRow[]>([]);
  const [agreements, setAgreements] = useState<AgreementRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const docSnap = await db
          .collection('users')
          // @ts-ignore - using compat-style accessor for admin check
          .doc(user.uid)
          .get();
        const data = (docSnap.exists ? (docSnap.data() as AdminUserDoc) : {}) || {};
        setIsAdmin(Boolean(data.isAdmin));
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pairsSnap = await getDocs(collection(db, 'resolution_pairs'));
        const agreementsSnap = await getDocs(collection(db, 'resolution_agreements'));

        const pairRows: ResolutionPairRow[] = [];
        pairsSnap.forEach((docSnap) => {
          const data = docSnap.data() as any;
          pairRows.push({
            id: docSnap.id,
            partnerAEmail: data.partnerAEmail || null,
            partnerBEmail: data.partnerBEmail
          });
        });
        const agreementRows: AgreementRow[] = [];
        agreementsSnap.forEach((docSnap) => {
          const data = docSnap.data() as any;
          agreementRows.push({
            id: docSnap.id,
            id: data.id,
            timestamp: data.timestamp,
            summary: data.summary,
            commitments: data.commitments || [],
            reviewDate: data.reviewDate,
            participants: data.participants || [],
            categories: data.categories || [],
            ownerUid: data.ownerUid || null,
            partnerRole: data.partnerRole,
            pairId: data.pairId || null,
            createdAt: data.createdAt
          } as AgreementRow);
        });
        setPairs(pairRows);
        setAgreements(agreementRows);
      } catch (e: any) {
        setError(e.message || 'Failed to load vault data.');
      }
    };

    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Checking admin access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-6 space-y-3">
          <h1 className="text-lg font-bold text-slate-800">Admin only</h1>
          <p className="text-sm text-slate-500">
            This vault dashboard is only available to admin users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-slate-50">
      <div className="w-full max-w-5xl mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Admin Vault & Pairings</h1>
        <p className="text-sm text-slate-500">
          View all pairings and archived agreements across couples.
        </p>
      </div>

      <main className="w-full max-w-5xl space-y-6">
        <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Pairings</h2>
            <span className="text-xs text-slate-400">{pairs.length} total</span>
          </div>
          {pairs.length === 0 ? (
            <p className="text-sm text-slate-400">No pairings yet.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {pairs.map((pair) => {
                const related = agreements.filter((a) => a.pairId === pair.id);
                return (
                  <div
                    key={pair.id}
                    className="flex items-center justify-between border border-slate-200 rounded-2xl px-4 py-2"
                  >
                    <div className="text-sm text-slate-700">
                      <div className="font-semibold">
                        {pair.partnerAEmail || 'Partner A'} &nbsp;↔&nbsp; {pair.partnerBEmail}
                      </div>
                      {related.length > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                          {related.length} archived agreement{related.length > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      Pair ID: <span className="font-mono">{pair.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Agreements</h2>
            <span className="text-xs text-slate-400">{agreements.length} total</span>
          </div>
          {error && <p className="text-xs text-rose-600 mb-2">{error}</p>}
          {agreements.length === 0 ? (
            <p className="text-sm text-slate-400">No archived agreements yet.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {agreements.map((agreement) => {
                const pair = agreement.pairId
                  ? pairs.find((p) => p.id === agreement.pairId) || null
                  : null;
                return (
                  <div
                    key={agreement.id}
                    className="border border-slate-200 rounded-2xl px-4 py-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {agreement.summary || 'Untitled agreement'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(agreement.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    {pair && (
                      <p className="text-xs text-slate-500">
                        Pair: {pair.partnerAEmail || 'Partner A'} ↔ {pair.partnerBEmail}
                      </p>
                    )}
                    {agreement.categories && agreement.categories.length > 0 && (
                      <p className="text-[11px] text-slate-500">
                        Categories: {agreement.categories.join(', ')}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400">
                      Owner UID: {agreement.ownerUid || '—'} • Role: {agreement.partnerRole} • Pair:{' '}
                      {agreement.pairId || '—'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminVault;


