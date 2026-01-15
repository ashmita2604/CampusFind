import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyASrrsa3QYTRiu8zWfTA83_c5Kj0aISXa0",
  authDomain: "campusfind-a0b69.firebaseapp.com",
  projectId: "campusfind-a0b69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadItemDetails() {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");

  if (!itemId) {
    alert("Item not found");
    return;
  }

  try {
    const docRef = doc(db, "lostItems", itemId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Item does not exist");
      return;
    }

    const item = docSnap.data();

    document.getElementById("itemName").textContent = item.itemName;
    document.getElementById("itemCategory").textContent = item.category;
    document.getElementById("itemLocation").textContent = item.location;
    document.getElementById("itemDate").textContent = item.dateLost;
    document.getElementById("itemDescription").textContent = item.description;

    document.getElementById("itemImage").innerHTML =
      item.imageLink
        ? `<img src="${item.imageLink}" style="max-width:100%;border-radius:12px;">`
        : `<i class="fa-solid fa-circle-xmark"></i>`;

    document.getElementById("claimBtn").onclick = () => {
      alert("Next: Chat / Email connection 💬📧");
    };

  } catch (error) {
    console.error("Error loading item:", error);
    alert("Something went wrong 😢");
  }
}

loadItemDetails();
