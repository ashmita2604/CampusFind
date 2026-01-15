import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyASrrsa3QYTRiu8zWfTA83_c5Kj0aISXa0",
  authDomain: "campusfind-a0b69.firebaseapp.com",
  projectId: "campusfind-a0b69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const itemsContainer = document.getElementById("itemsContainer");

const q = query(collection(db, "foundItems"), orderBy("createdAt", "desc"));
const snapshot = await getDocs(q);

itemsContainer.innerHTML = "";

snapshot.forEach(docSnap => {
  const item = docSnap.data();

  itemsContainer.innerHTML += `
    <div class="item-card">
      ${
        item.imageLink
          ? `<img src="${item.imageLink}" style="width:100%;height:150px;object-fit:cover;border-radius:10px;">`
          : `<i class="fa-solid fa-box"></i>`
      }

      <h3>${item.itemName}</h3>
      <p><strong>Found At:</strong> ${item.location}</p>
      <p><strong>Date:</strong> ${item.dateFound}</p>

      <button onclick="location.href='found_item-details.html?id=${docSnap.id}'">
        View Details
      </button>
    </div>
  `;
});
