// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASrrsa3QYTRiu8zWfTA83_c5Kj0aISXa0",
  authDomain: "campusfind-a0b69.firebaseapp.com",
  projectId: "campusfind-a0b69",
  storageBucket: "campusfind-a0b69.firebasestorage.app",
  messagingSenderId: "3312120050",
  appId: "1:3312120050:web:ed685db2fc3a7a6910a06b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form reference
const lostForm = document.getElementById("lostForm");

// Submit event
lostForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("loggedInUserId");

  if (!userId) {
    alert("You must be logged in to report a lost item.");
    return;
  }

  // Get form values
  const itemName = document.getElementById("itemName").value;
  const category = document.getElementById("category").value;
  const location = document.getElementById("location").value;
  const dateLost = document.getElementById("dateLost").value;
  const description = document.getElementById("description").value;
  const imageUrl = document.getElementById("imageLink")?.value || "";

  try {
    await addDoc(collection(db, "lostItems"), {
      itemName,
      category,
      location,
      dateLost,
      description,
      imageUrl,    
      userId,
      status: "lost",
      createdAt: serverTimestamp()
    });

    alert("Lost item reported successfully!");
    window.location.href = "lost-items.html";

  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Something went wrong. Please try again.");
  }
});
