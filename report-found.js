import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyASrrsa3QYTRiu8zWfTA83_c5Kj0aISXa0",
  authDomain: "campusfind-a0b69.firebaseapp.com",
  projectId: "campusfind-a0b69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const foundForm = document.getElementById("foundForm");

foundForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const finderId = localStorage.getItem("loggedInUserId");

  if (!finderId) {
    alert("Please login first");
    return;
  }

  const itemName = document.getElementById("itemName").value;
  const category = document.getElementById("category").value;
  const location = document.getElementById("location").value;
  const dateFound = document.getElementById("dateFound").value;
  const description = document.getElementById("description").value;
  const handover = document.getElementById("handover").value;
  const userId = localStorage.getItem("loggedInUserId");
  let imageLink = document.getElementById("imageLink").value;

  // Convert Google Drive link (IMPORTANT)
  if (imageLink.includes("drive.google.com")) {
    imageLink = imageLink
      .replace("file/d/", "uc?id=")
      .replace("/view?usp=drivesdk", "")
      .replace("/view", "");
  }

  try {
    await addDoc(collection(db, "foundItems"), {
      itemName,
      category,
      location,
      dateFound,
      description,
      handover,
      imageLink,
      finderId,
      status: "found",
      createdAt: serverTimestamp()
    });

    alert("Found item posted successfully 💚");
    window.location.href = "found-items.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong 😢");
  }
});
