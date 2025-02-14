import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDGeC2t1toF4qNwwEhiWBpnGSFnxj4a-Co",
    authDomain: "study-buddy-1322a.firebaseapp.com",
    databaseURL: "https://study-buddy-1322a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "study-buddy-1322a",
    storageBucket: "study-buddy-1322a.firebasestorage.app",
    messagingSenderId: "871105101023",
    appId: "1:871105101023:web:9036346ac1f12e0acf7d6a"
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  export { db, auth };
