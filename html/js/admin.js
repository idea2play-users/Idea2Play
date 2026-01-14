import { db, protectAdmin } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

protectAdmin();

async function loadAdmin() {
  document.getElementById("totalUsers").innerText =
    (await getDocs(collection(db, "users"))).size;

  document.getElementById("totalProjects").innerText =
    (await getDocs(collection(db, "projects"))).size;

  document.getElementById("publishedProjects").innerText =
    (await getDocs(query(collection(db, "projects"), where("published", "==", true)))).size;

  document.getElementById("totalOrders").innerText =
    (await getDocs(collection(db, "orders"))).size;

  const ordersBox = document.getElementById("orders");
  const recent = await getDocs(
    query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(10))
  );

  recent.forEach(d => {
    const o = d.data();
    ordersBox.innerHTML += `
      <div class="order-card">
        <h4>${o.projectTitle}</h4>
        <p>${o.name} (${o.email})</p>
        <p>Status: ${o.status}</p>
      </div>
    `;
  });
}

window.updateStatus = async (id, status) => {
  await updateDoc(doc(db, "orders", id), { status });
  alert("Status updated");
};

loadAdmin();
