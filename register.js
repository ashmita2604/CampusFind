// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const signUpButton = document.getElementById("signUpButton");
const signInButton = document.getElementById("signInButton");
const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");

// Your web app's Firebase configuration
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

// Sign-up message
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

//Sign-up function
signUpButton.addEventListener("click", function (event) {

  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("signup-password").value;
  const username = document.getElementById("username").value;


  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      const userData = {
        email: email,
        username: username
      };
      console.log("Account created")
      showMessage('Account Created Successfully', 'signUpMessage');
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          // switch to Sign-In form
          signUpForm.classList.add("hidden");
          signInForm.classList.remove("hidden");
        })
        .catch((error) => {
          console.error("error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists', 'signUpMessage');
      }
      else {
        showMessage('Unable to create User', 'signUpMessage');
      }
      console.log(errorMessage)
    });
});


//Sign-In function
signInButton.addEventListener("click", function (event) {

  event.preventDefault();
  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;
  const username = document.getElementById("signin-username").value;


  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      showMessage('Logged In Successfully', 'signInMessage');
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = 'homepage.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/invalid-credential') {
        showMessage('Incorrect Email or Password', 'signInMessage');
      }
      else {
        showMessage('Account does not exists', 'signInMessage');
      }
    });
});
