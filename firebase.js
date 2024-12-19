import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvs-HEvXhNjwjRmM1p0ZIDAzaSeQP58DQ",
  authDomain: "social-media-feed-2963e.firebaseapp.com",
  projectId: "social-media-feed-2963e",
  storageBucket: "social-media-feed-2963e.firebasestorage.app",
  messagingSenderId: "687285033811",
  appId: "1:687285033811:web:0a4fb437cf5c85ff4f1fa6",
  measurementId: "G-S79CV8EWNV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut, db, collection, addDoc, getDocs, query, orderBy, limit, startAfter };
