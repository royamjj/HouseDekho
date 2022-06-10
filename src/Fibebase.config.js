// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAJrfXvNjqJjRPS-38gDsLYLWqHJM6IHRc",
  authDomain: "housedekho.firebaseapp.com",
  projectId: "housedekho",
  storageBucket: "housedekho.appspot.com",
  messagingSenderId: "199722567036",
  appId: "1:199722567036:web:ce326fc16c649f20e150f9",
  measurementId: "G-EJ6MN288LJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);