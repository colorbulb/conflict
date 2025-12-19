import React, { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import App from '../App';
import { Partner } from '../types';

interface ResolutionPair {
  id: string;
  partnerAUid: string;
  partnerAEmail: string | null;
  partnerBUid: string | null;
  partnerBEmail: string;
  createdAt?: unknown;
}

const PairingDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pairs, setPairs] = useState<ResolutionPair[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loadingPairs, setLoadingPairs] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionPair, setSessionPair] = useState<ResolutionPair | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setPairs([]);
      return;
    }

    setLoadingPairs(true);
    setError(null);

    const ref = collection(db, 'resolution_pairs');
    const q = query(
      ref,
      where('memberUids', 'array-contains', user.uid)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: ResolutionPair[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as any;
          list.push({
            id: docSnap.id,
            partnerAUid: data.partnerAUid,
            partnerAEmail: data.partnerAEmail || null,
            partnerBUid: data.partnerBUid || null,
            partnerBEmail: data.partnerBEmail,
            createdAt: data.createdAt
          });
        });
        setPairs(list);
        setLoadingPairs(false);
      },
      () => {
        setError('Failed to load pairings.');
        setLoadingPairs(false);
      }
    );

    return () => unsub();
  }, [user]);

  const handleCreatePair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteEmail.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await addDoc(collection(db, 'resolution_pairs'), {
        partnerAUid: user.uid,
        partnerAEmail: user.email || null,
        partnerBUid: null,
        partnerBEmail: inviteEmail.trim().toLowerCase(),
        memberUids: [user.uid],
        createdAt: serverTimestamp()
      });
      setInviteEmail('');
    } catch (err: any) {
      setError(err.message || 'Could not create pairing.');
    } finally {
      setCreating(false);
    }
  };

  const handleAcceptInvite = async (pair: ResolutionPair) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'resolution_pairs', pair.id), {
        partnerBUid: user.uid,
        memberUids: [pair.partnerAUid, user.uid]
      });
    } catch (err: any) {
      setError(err.message || 'Could not accept invite.');
    }
  };

  const visiblePairs = pairs;

  if (!user) {
    return null;
  }

  if (sessionPair) {
    const role: Partner = user.uid === sessionPair.partnerAUid ? 'Partner A' : 'Partner B';
    return <App initialPartner={role} pairId={sessionPair.id} />;
  }

  const hasPendingInviteAsB = pairs.some(
    (p) =>
      !p.partnerBUid &&
      p.partnerBEmail.toLowerCase() === (user.email || '').toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-slate-50">
      <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Your Resolution Lab Pairings</h1>
          <p className="text-sm text-slate-500">
            Invite partners into pairs and enter sessions. You will appear as Partner A or Partner B depending on the pairing.
          </p>
        </div>
      </div>

      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 flex flex-col gap-6">
        <form className="space-y-3" onSubmit={handleCreatePair}>
          <p className="text-sm font-semibold text-slate-700">Invite a partner (you will be Partner A)</p>
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Partner's email"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
            >
              {creating ? 'Sending…' : 'Send Invite'}
            </button>
          </div>
        </form>

        {hasPendingInviteAsB && (
          <p className="text-sm text-indigo-700">
            You have invitations waiting where you will be Partner B. Accept one to link the pairing.
          </p>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Your pairings</p>
            {loadingPairs && (
              <span className="text-xs text-slate-400">Loading…</span>
            )}
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          {visiblePairs.length === 0 && !loadingPairs ? (
            <p className="text-sm text-slate-400">
              No pairings yet. Invite your partner by email to get started, or accept an invite sent to your email.
            </p>
          ) : (
            <div className="space-y-3">
              {visiblePairs.map((pair) => {
                const isPendingB =
                  !pair.partnerBUid &&
                  pair.partnerBEmail.toLowerCase() ===
                    (user.email || '').toLowerCase();
                const youAreA = pair.partnerAUid === user.uid;
                const youAreB = pair.partnerBUid === user.uid;
                return (
                  <div
                    key={pair.id}
                    className="flex items-center justify-between border border-slate-200 rounded-2xl px-4 py-3"
                  >
                    <div className="text-sm text-slate-700">
                      <div className="font-semibold">
                        {pair.partnerAEmail || 'Partner A'} &nbsp;↔&nbsp; {pair.partnerBEmail}
                      </div>
                      {(youAreA || youAreB) && (
                        <p className="text-xs text-slate-500 mt-1">
                          You are {youAreA ? 'Partner A' : 'Partner B'} in this pairing.
                        </p>
                      )}
                      {isPendingB && (
                        <p className="text-xs text-amber-600 mt-1">
                          Invitation pending — click Accept to link this pairing.
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isPendingB && (
                        <button
                          onClick={() => handleAcceptInvite(pair)}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                        >
                          Accept
                        </button>
                      )}
                      {!isPendingB && (youAreA || youAreB) && (
                        <button
                          onClick={() => setSessionPair(pair)}
                          className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                        >
                          Enter Resolution Lab
                        </button>
                      )}
                    </div>
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

export default PairingDashboard;


