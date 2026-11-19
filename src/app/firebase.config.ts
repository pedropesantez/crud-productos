import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCSDGGnMlBF5AbLwi6rhFlwjuyRHLVaZWE",
  authDomain: "angular-productos-5564a.firebaseapp.com",
  projectId: "angular-productos-5564a",
  storageBucket: "angular-productos-5564a.firebasestorage.app",
  messagingSenderId: "158291904069",
  appId: "1:158291904069:web:c79df7da1b1d756c75452c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

