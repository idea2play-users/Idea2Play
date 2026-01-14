import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

fetch("./components/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML("afterbegin", html);

    auth.onAuthStateChanged(user => {
      document.querySelectorAll(".auth-only")
        .forEach(el => el.style.display = user ? "inline-block" : "none");

      document.querySelectorAll(".guest-only")
        .forEach(el => el.style.display = user ? "none" : "inline-block");

      document.querySelectorAll(".admin-only")
        .forEach(el => {
          el.style.display =
            user?.email === "idea2play2@gmail.com" ? "inline-block" : "none";
        });
    });

    document.getElementById("logoutBtn")?.addEventListener("click", async () => {
      await signOut(auth);
      location.href = "./index.html";
    });
  });
