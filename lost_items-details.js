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

    //FETCH ITEM
    const item = docSnap.data();

    // FETCH OWNER EMAIL
    const ownerSnap = await getDoc(doc(db, "users", item.userId));

    if (!ownerSnap.exists()) {
      alert("Owner details not found 😢");
      return;
    }

    const ownerEmail = ownerSnap.data().email;


    document.getElementById("itemName").textContent = item.itemName;
    document.getElementById("itemCategory").textContent = item.category;
    document.getElementById("itemLocation").textContent = item.location;
    document.getElementById("itemDate").textContent = item.dateLost;
    document.getElementById("itemDescription").textContent = item.description;

    document.getElementById("itemImage").innerHTML =
      item.imageLink
        ? `<img src="${item.imageLink}" style="max-width:100%;border-radius:12px;">`
        : `<i class="fa-solid fa-circle-xmark"></i>`;

    document.getElementById("claimBtn").onclick = async () => {
      const finderEmail = localStorage.getItem("loggedInUserEmail");

      if (!finderEmail) {
        alert("Please login to contact the owner 🔐");
        return;
      }

      emailjs.send(
        "service_sx06fwy",
        "template_0u70pyl",
        {
          to_email: ownerEmail,
          item_name: item.itemName,
          finder_email: finderEmail,
          last_seen_location: item.location
        }
      )
        .then(() => {
          alert("Email sent to owner 📧✨ They will contact you soon!");
        })
        .catch(err => {
          console.error("Email error ❌", err);
          alert("Failed to send email 😢");
        });
    };

  } catch (error) {
    console.error("Error loading item:", error);
    alert("Something went wrong 😢");
  }
}

loadItemDetails();
