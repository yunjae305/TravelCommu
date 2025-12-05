import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvM6XK7sXWPNoxc0D3Pas_kNErutdvgFM",
  authDomain: "travel-9bade.firebaseapp.com",
  projectId: "travel-9bade",
  storageBucket: "travel-9bade.firebasestorage.app",
  messagingSenderId: "739143082934",
  appId: "1:739143082934:web:8f10c182ade6794dd59717",
  databaseURL: "https://travel-9bade-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
export default app;
