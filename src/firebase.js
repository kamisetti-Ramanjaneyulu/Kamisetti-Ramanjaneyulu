 import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import getFirestore
//import { initializeApp } from 'firebase/app';
//import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBby-02nnIUtLKYpF8XsnoeLbmLbq-nslk",
  authDomain: "noticeborad-53a59.firebaseapp.com",
  databaseURL: "https://noticeborad-53a59-default-rtdb.firebaseio.com",
  projectId: "noticeborad-53a59",
  storageBucket: "noticeborad-53a59.appspot.com",
  messagingSenderId: "646693531069",
  appId: "1:646693531069:web:a4e717a347754e773a76d4",
  measurementId: "G-YS5Z7W422H"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
 const auth = getAuth(app);
 const db = getFirestore(app); // Export db
 const storage = getStorage(app);
 
 export {  db,app, storage, auth };


