import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyASrrsa3QYTRiu8zWfTA83_c5Kj0aISXa0",
  authDomain: "campusfind-a0b69.firebaseapp.com",
  projectId: "campusfind-a0b69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const lostItemsList = document.getElementById("lostItemsList");

async function loadLostItems() {
  try {
    const querySnapshot = await getDocs(collection(db, "lostItems"));

    lostItemsList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const item = doc.data();

      const card = document.createElement("div");
      card.className = "item-card";

      card.innerHTML = `
        ${item.imageLink
          ? `<img src="${item.imageLink}" style="width:100%;height:150px;object-fit:cover;border-radius:10px;">`
          : `<i class="fa-solid fa-circle-xmark"></i>`}

        <h3>${item.itemName}</h3>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Date:</strong> ${item.dateLost}</p>

        <button onclick="location.href='lost_items-details.html?id=${doc.id}'">
          Contact Owner
        </button>
      `;

      lostItemsList.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading lost items:", error);
    alert("Failed to load lost items 😢");
  }
}

loadLostItems();
