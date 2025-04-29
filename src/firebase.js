import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3hjU5KxfIApIYKHtJZx_aF7a5LV2ImhY",
  authDomain: "toothcraft-6d7b3.firebaseapp.com",
  projectId: "toothcraft-6d7b3",
  storageBucket: "toothcraft-6d7b3.firebasestorage.app",
  messagingSenderId: "541290365771",
  appId: "1:541290365771:web:229b46bb7cf8237c941ece",
  measurementId: "G-3QGJP8CM3P"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
