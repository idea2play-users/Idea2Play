import { auth, logoutUser } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, user => {
  document.querySelectorAll(".auth-only")
    .forEach(el => el.style.display = user ? "inline-block" : "none");

  document.querySelectorAll(".guest-only")
    .forEach(el => el.style.display = user ? "none" : "inline-block");

  document.querySelectorAll(".admin-only")
    .forEach(el => {
      el.style.display =
        user && user.email === "idea2play2@gmail.com" ? "inline-block" : "none";
    });
});

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await logoutUser();
  location.href = "./index.html";
});
