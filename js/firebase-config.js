// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALNlMLF-Fxu87Ge5yfhp2m1R-vU58XcLo",
  authDomain: "besides-sm.firebaseapp.com",
  projectId: "besides-sm",
  storageBucket: "besides-sm.firebasestorage.app",
  messagingSenderId: "897908486036",
  appId: "1:897908486036:web:e39140f75bec1b4d4de981",
  measurementId: "G-BB0NMVRFLY"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const analytics = firebase.analytics();
