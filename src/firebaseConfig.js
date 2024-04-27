// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvPiNed2rmJKDB0pOQjVhY_W8_heyr3AA",
  authDomain: "final-project-772fd.firebaseapp.com",
  projectId: "final-project-772fd",
  storageBucket: "final-project-772fd.appspot.com",
  messagingSenderId: "431008853510",
  appId: "1:431008853510:web:df3c9a6d74399eb7511d87",
  measurementId: "G-GS37VV5VSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
