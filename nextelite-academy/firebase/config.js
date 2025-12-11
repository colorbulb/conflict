// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANDwix9QLvTBxmgksPumap7oEihe2UdYE",
  authDomain: "nextelitefnweb.firebaseapp.com",
  projectId: "nextelitefnweb",
  storageBucket: "nextelitefnweb.firebasestorage.app",
  messagingSenderId: "496900220544",
  appId: "1:496900220544:web:5d627b87ee1ec0e2e76865"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Export the app instance
export default app;