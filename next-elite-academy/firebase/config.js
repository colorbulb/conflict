// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANDwix9QLvTBxmgksPumap7oEihe2UdYE",
  authDomain: "nextelitefnweb.firebaseapp.com",
  projectId: "nextelitefnweb",
  storageBucket: "nextelitefnweb.firebasestorage.app",
  messagingSenderId: "496900220544",
  appId: "1:496900220544:web:67c549f5d7176b97e76865"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);