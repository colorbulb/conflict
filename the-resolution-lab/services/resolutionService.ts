import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { NegotiatedAgreement } from '../types';

const AGREEMENTS_COLLECTION = 'resolution_agreements';

export interface StoredAgreement extends NegotiatedAgreement {
  ownerUid: string | null;
  partnerRole: 'Partner A' | 'Partner B' | 'Both';
  pairId: string | null;
  createdAt: unknown;
}

export async function saveAgreementToFirestore(
  agreement: NegotiatedAgreement,
  options: { ownerUid: string | null; partnerRole: 'Partner A' | 'Partner B' | 'Both'; pairId: string | null }
): Promise<void> {
  await addDoc(collection(db, AGREEMENTS_COLLECTION), {
    ...agreement,
    ownerUid: options.ownerUid,
    partnerRole: options.partnerRole,
    pairId: options.pairId,
    createdAt: serverTimestamp()
  });
}


