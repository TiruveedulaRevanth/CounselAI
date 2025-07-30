// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "empathai-3u1xm",
  appId: "1:139708921081:web:0c6b905969611a8c0b9e28",
  storageBucket: "empathai-3u1xm.firebasestorage.app",
  apiKey: "AIzaSyDCl82V263yHdSuFfTjcfrDWvxum991nto",
  authDomain: "empathai-3u1xm.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "139708921081"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
