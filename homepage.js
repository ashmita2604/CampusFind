// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASrrsa3QYTRiu8zWfTA83_c5Kj0aISXa0",
  authDomain: "campusfind-a0b69.firebaseapp.com",
  projectId: "campusfind-a0b69",
  storageBucket: "campusfind-a0b69.firebasestorage.app",
  messagingSenderId: "3312120050",
  appId: "1:3312120050:web:ed685db2fc3a7a6910a06b",
  measurementId: "G-VENDJBWCE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user)=> {
  const loggedInUserId=localStorage.getItem('loggedInUserId');
  if(loggedInUserId) {
    const docRef= doc(db, "users", loggedInUserId);
    getDoc(docRef)
    .then((docSnap)=>{
      if(docSnap.exists()) {
        const userData=docSnap.data();
        document.getElementById('loggedUserUsername').innerText=userData.username;
      }
      else {
        console.log("no document found matching id!!!")
      }
    })
    .catch((error)=> {
      console.log("error getting document");
    })
  }
  else {
    console.log("User id not Found in Local Storage");
  }
})
