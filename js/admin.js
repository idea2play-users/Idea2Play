import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.updateStatus = async (orderId, status) => {
  const ref = doc(db, "orders", orderId);
  await updateDoc(ref, { status });

await fetch("/api/sendOrderStatusEmail", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ orderId, status })
});

  alert("Order status updated");
};

import { db, protectAdmin } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

protectAdmin();

// COLLECTION REFERENCES
const usersRef = collection(db, "users");
const projectsRef = collection(db, "projects");
const ordersRef = collection(db, "orders");

// TOTAL USERS
const usersSnap = await getDocs(usersRef);
document.getElementById("totalUsers").innerText = usersSnap.size;

// TOTAL PROJECTS
const projectsSnap = await getDocs(projectsRef);
document.getElementById("totalProjects").innerText = projectsSnap.size;

// PUBLISHED PROJECTS
const publishedSnap = await getDocs(
  query(projectsRef, where("published", "==", true))
);
document.getElementById("publishedProjects").innerText = publishedSnap.size;

// TOTAL ORDERS
const ordersSnap = await getDocs(ordersRef);
document.getElementById("totalOrders").innerText = ordersSnap.size;

// ORDERS BY STATUS
const statuses = ["pending", "in_deposit", "processing", "completed"];
const statsBox = document.getElementById("orderStats");

for (const status of statuses) {
  const snap = await getDocs(
    query(ordersRef, where("status", "==", status))
  );
ordersBox.innerHTML += `
  <div class="order-card">
    <h4>${o.projectTitle}</h4>
    <p>${o.name} (${o.email})</p>

    <select onchange="updateStatus('${doc.id}', this.value)">
      <option ${o.status === "pending" ? "selected" : ""}>pending</option>
      <option ${o.status === "in_deposit" ? "selected" : ""}>in_deposit</option>
      <option ${o.status === "processing" ? "selected" : ""}>processing</option>
      <option ${o.status === "completed" ? "selected" : ""}>completed</option>
    </select>
  </div>
`;


  statsBox.innerHTML += `
    <div class="stat-row">
      <strong>${status}</strong>: ${snap.size}
    </div>
  `;
}

// RECENT ORDERS
const recentOrders = await getDocs(
  query(ordersRef, orderBy("createdAt", "desc"), limit(10))
);

const ordersBox = document.getElementById("orders");

recentOrders.forEach(doc => {
  const o = doc.data();
  ordersBox.innerHTML += `
    <div class="order-card">
      <h4>${o.projectTitle}</h4>
      <p>${o.name} (${o.email})</p>
      <p>Status: ${o.status}</p>
    </div>
  `;
});
