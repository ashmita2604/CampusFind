import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyASrrsa3QYTRiu8zWfTA83_c5Kj0aISXa0",
  authDomain: "campusfind-a0b69.firebaseapp.com",
  projectId: "campusfind-a0b69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const claimerId = localStorage.getItem("loggedInUserId");

const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");

if (!itemId) {
  alert("Invalid Item");
  throw new Error("No item ID");
}

const itemRef = doc(db, "foundItems", itemId);
const itemSnap = await getDoc(itemRef);

if (!itemSnap.exists()) {
  alert("Item not found");
  throw new Error("Item missing");
}

const item = itemSnap.data();

/* 🔹 DISPLAY ITEM DATA */
document.getElementById("itemName").textContent = item.itemName;
document.getElementById("itemCategory").textContent = item.category;
document.getElementById("itemLocation").textContent = item.location;
document.getElementById("itemDate").textContent = item.dateFound;
document.getElementById("itemDescription").textContent = item.description;

document.getElementById("itemImage").innerHTML =
  item.imageLink
    ? `<img src="${item.imageLink}" style="max-width:100%;border-radius:12px;">`
    : `<i class="fa-solid fa-box"></i>`;

/* 🔹 CLAIM LOGIC */
const claimBtn = document.getElementById("claimBtn");

claimBtn.onclick = async () => {
  try {
    if (!claimerId) {
      alert("Please login to claim this item.");
      return;
    }

    const itemRef = doc(db, "foundItems", itemId);
    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) {
      alert("Item not found");
      return;
    }

    const item = itemSnap.data();
    const ownerId = item.finderId; // ✅ FIX

    if (!ownerId) {
      alert("Owner information missing ❌");
      return;
    }

    if (ownerId === claimerId) {
      alert("You cannot claim your own item 😅");
      return;
    }

    // 1️⃣ Create claim request
    await addDoc(collection(db, "claims"), {
      itemId,
      itemType: "found",
      ownerId: ownerId,
      claimerId,
      status: "pending",
      createdAt: serverTimestamp()
    });

    // 2️⃣ Update found item status
    await updateDoc(itemRef, {
      status: "claimed"
    });

    alert("Claim request sent successfully! 📨");
    claimBtn.disabled = true;
    claimBtn.innerText = "Claim Sent";

  } catch (error) {
    console.error("CLAIM ERROR ❌", error);
    alert("Claim failed 😭");
  }
};
