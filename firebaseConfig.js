// firebaseConfig.js (ESM)
// Firebase Web SDK (v10+) via CDN modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYCwA4gKMzZ-W2vAPxwS5mBBEOOI5EKm8",
  authDomain: "geniusmode-marking.firebaseapp.com",
  projectId: "geniusmode-marking",
  storageBucket: "geniusmode-marking.firebasestorage.app",
  messagingSenderId: "664335373954",
  appId: "1:664335373954:web:74f8cf272161ea8096469b"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
