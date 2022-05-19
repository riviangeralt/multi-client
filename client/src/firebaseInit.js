import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhLNRrga_kbUqX7rjo6egMvpXJyF-KZ1M",
  authDomain: "multiclient-4725b.firebaseapp.com",
  projectId: "multiclient-4725b",
  storageBucket: "multiclient-4725b.appspot.com",
  messagingSenderId: "612882616484",
  appId: "1:612882616484:web:56845c3562c9bcf2ff9631",
  measurementId: "G-7NQ4DTJ45T",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
