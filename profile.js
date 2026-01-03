import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyASrrsa3QYTRiu8zWfTA83_c5Kj0aISXa0",
  authDomain: "campusfind-a0b69.firebaseapp.com",
  projectId: "campusfind-a0b69",
  storageBucket: "campusfind-a0b69.firebasestorage.app",
  messagingSenderId: "3312120050",
  appId: "1:3312120050:web:ed685db2fc3a7a6910a06b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

const userId = localStorage.getItem("loggedInUserId");

const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");

const editUsername = document.getElementById("editUsername");
const editEmail = document.getElementById("editEmail");

const viewMode = document.getElementById("viewMode");
const editMode = document.getElementById("editMode");

// LOAD PROFILE
async function loadProfile() {
  if (!userId) return;

  const snap = await getDoc(doc(db, "users", userId));
  if (snap.exists()) {
    const data = snap.data();
    profileUsername.innerText = data.username;
    profileEmail.innerText = data.email;

    editUsername.value = data.username;
    editEmail.value = data.email;
  }
}

loadProfile();

// EDIT
document.getElementById("editBtn").onclick = () => {
  viewMode.classList.add("hidden");
  editMode.classList.remove("hidden");
};

// CANCEL (reload page)
document.getElementById("cancelBtn").onclick = () => {
  location.reload();
};

// SAVE + reload
document.getElementById("saveBtn").onclick = async () => {
  await updateDoc(doc(db, "users", userId), {
    username: editUsername.value,
    email: editEmail.value
  });

  location.reload();
};

