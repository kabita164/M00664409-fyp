// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLr3j2zdAAhPiLJT22FVgfDbBBENOwnkY",
  authDomain: "fy-project-6ab2b.firebaseapp.com",
  projectId: "fy-project-6ab2b",
  storageBucket: "fy-project-6ab2b.appspot.com",
  messagingSenderId: "237173829461",
  appId: "1:237173829461:web:738d39ad0bb46afc2e89dc",
  measurementId: "G-ZM5LNDC8JF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
