import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUDWfMA0Z5R7rvM4PbZ8iyfQXjhgfJHzw",
  authDomain: "thor-voice-time.firebaseapp.com",
  projectId: "thor-voice-time",
  storageBucket: "thor-voice-time.appspot.com",
  messagingSenderId: "202077755349",
  appId: "1:202077755349:web:f9dbc0fcc9e8a0ab590f5c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
