// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxfsLUpg9An-yOAxtBhQQcfKrYSLsg3GE",
  authDomain: "fir-crud-511d3.firebaseapp.com",
  projectId: "fir-crud-511d3",
  storageBucket: "fir-crud-511d3.appspot.com",
  messagingSenderId: "974190829808",
  appId: "1:974190829808:web:30b2f40c89ddb1832e2235",
  measurementId: "G-XH37EF4LSK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)
