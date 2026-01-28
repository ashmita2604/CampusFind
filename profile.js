import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

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

async function loadStats() {
  if (!userId) return;

  // LOST items reported
  const lostQuery = query(
    collection(db, "lostItems"),
    where("userId", "==", userId)
  );

  // FOUND items reported
  const foundQuery = query(
    collection(db, "foundItems"),
    where("userId", "==", userId)
  );

  // RETURNED items
  const returnedQuery = query(
    collection(db, "foundItems"),
    where("userId", "==", userId),
    where("status", "==", "returned")
  );

  const lostSnap = await getDocs(lostQuery);
  const foundSnap = await getDocs(foundQuery);
  const returnedSnap = await getDocs(returnedQuery);

  document.getElementById("itemsReportedCount").innerText =
    lostSnap.size + foundSnap.size;

  document.getElementById("itemsReturnedCount").innerText =
    returnedSnap.size;
}


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

const claimsList = document.getElementById("claimsList");

async function loadClaimRequests() {
  if (!userId) return;

  const q = query(
    collection(db, "claims"),
    where("ownerId", "==", userId),
    where("status", "==", "pending")
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    claimsList.innerHTML = `<p class="empty-text">No pending claims 💤</p>`;
    return;
  }

  claimsList.innerHTML = "";

  for (const docSnap of snap.docs) {
    const claim = docSnap.data();

    // fetch claimer details
    const claimerSnap = await getDoc(doc(db, "users", claim.claimerId));
    const claimerEmail = claimerSnap.exists()
      ? claimerSnap.data().email
      : "";


    // fetch item details
    const itemSnap = await getDoc(doc(db, "foundItems", claim.itemId));
    const itemName = itemSnap.exists()
      ? itemSnap.data().itemName
      : "Unknown Item";

    const div = document.createElement("div");
    div.className = "claim-card";

    div.innerHTML = `
      <p><strong>Item:</strong> ${itemName}</p>
      <p><strong>Claimer ID:</strong> ${claim.claimerId}</p>

      <div class="claim-actions">
        <button class="approve">Approve</button>
        <button class="reject">Reject</button>
      </div>
    `;

    // APPROVE
    div.querySelector(".approve").onclick = async () => {
      // update claim status
      await updateDoc(doc(db, "claims", docSnap.id), {
        status: "approved"
      });

      // mark item as returned
      await updateDoc(doc(db, "foundItems", claim.itemId), {
        status: "returned"
      });

      // SEND EMAIL TO CLAIMER
      emailjs.send(
        "service_sx06fwy",
        "template_f829h5q",
        {
          to_email: claimerEmail,
          owner_email: profileEmail.innerText,
          item_name: itemName
        }
      )
        .then(() => {
          alert("Approval email sent to claimer 📬✨");
        })
        .catch(err => {
          console.error("Email failed ❌", err);
          alert("Email sending failed 😭");
        });

      loadClaimRequests();
    };


    // REJECT
    div.querySelector(".reject").onclick = async () => {
      await updateDoc(doc(db, "claims", docSnap.id), {
        status: "rejected"
      });

      await updateDoc(doc(db, "foundItems", claim.itemId), {
        status: "available"
      });

      loadClaimRequests();
    };

    claimsList.appendChild(div);
  }
}

loadClaimRequests();

loadStats();
