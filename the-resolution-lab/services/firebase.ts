import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Shared Firebase project (same as mbtichat2 / intjchat)
const firebaseConfig = {
  apiKey: 'AIzaSyCeNWoXGlC_cjXXATuauAmjBom-sVYjMEQ',
  authDomain: 'intjchat.firebaseapp.com',
  projectId: 'intjchat',
  storageBucket: 'intjchat.firebasestorage.app',
  messagingSenderId: '993280462756',
  appId: '1:993280462756:web:419149d011db77e743fb31',
  measurementId: 'G-KNYD34TDW8'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});


