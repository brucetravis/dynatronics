// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth }  from "firebase/auth"
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2INhLjX5hK949UU2V2JoGPROaas2j9B0",
  authDomain: "dynatronics-prod.firebaseapp.com",
  projectId: "dynatronics-prod",
  storageBucket: "dynatronics-prod.firebasestorage.app",
  messagingSenderId: "486044194420",
  appId: "1:486044194420:web:17ece5254b3ec2517ea321"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the firebase Authentication service to help sign up log in log out, track user login and track 
// their email (It is stored in the firbase database)
export const auth = getAuth(app)
// Initialize and export the firestore database/ service instance
export const db = getFirestore(app)
