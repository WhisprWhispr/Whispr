import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// TODO: Replace with your actual Firebase project configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDgoOIfbY7bQ7akyTVC9bbMGM74EWySCk0",
    authDomain: "whispr-68b53.firebaseapp.com",
    projectId: "whispr-68b53",
    storageBucket: "whispr-68b53.firebasestorage.app",
    messagingSenderId: "1018814255382",
    appId: "1:1018814255382:web:0aa1310a9a8213779bc037",
    measurementId: "G-N2R5DZGQVZ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
