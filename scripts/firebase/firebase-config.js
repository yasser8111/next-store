import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBoXoSi376ZtbrIDc0Oa4_yf8-tJKcHV-4",
  authDomain: "database-nextstore.firebaseapp.com",
  projectId: "database-nextstore",
  storageBucket: "database-nextstore.firebasestorage.app",
  messagingSenderId: "463214736059",
  appId: "1:463214736059:web:d882da8f1e06968eedef9e",
  measurementId: "G-M6M6KZ1W74",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
