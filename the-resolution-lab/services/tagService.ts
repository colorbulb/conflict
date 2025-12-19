import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export type ResolutionTagKind = 'feelings' | 'needs' | 'categories';

export interface ResolutionTagDocument {
  values: string[];
}

const TAG_COLLECTION = 'resolution_tags';

export async function getResolutionTags(kind: ResolutionTagKind): Promise<string[] | null> {
  try {
    const ref = doc(collection(db, TAG_COLLECTION), kind);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as ResolutionTagDocument;
    return Array.isArray(data.values) ? data.values : null;
  } catch (error) {
    console.error('Error loading resolution tags:', error);
    return null;
  }
}

export async function setResolutionTags(kind: ResolutionTagKind, values: string[]): Promise<void> {
  const ref = doc(collection(db, TAG_COLLECTION), kind);
  await setDoc(ref, { values });
}


