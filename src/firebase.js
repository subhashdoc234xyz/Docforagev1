import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace ALL values below with your actual Firebase project config
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtxjyp8PDxIoJf6_sUMY3FWTtdPw85JXA",
  authDomain: "docforge-1253b.firebaseapp.com",
  projectId: "docforge-1253b",
  storageBucket: "docforge-1253b.firebasestorage.app",
  messagingSenderId: "245105260131",
  appId: "1:245105260131:web:2d4a900f8e76ca61916a56",
  measurementId: "G-LFK39LQXTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);