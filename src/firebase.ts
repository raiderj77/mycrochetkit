import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB1YawXigzNaaj6l1N08Bn9CXfEWu9LWVk",
  authDomain: "mycrochet-kit.firebaseapp.com",
  projectId: "mycrochet-kit",
  storageBucket: "mycrochet-kit.firebasestorage.app",
  messagingSenderId: "784533445064",
  appId: "1:784533445064:web:8a6c74e88927d3413048fd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
