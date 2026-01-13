import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
const isAuthPage = location.pathname.includes("login.html");

fetch("/components/navbar.html")
  .then(res => res.text())
  .then(html => {
	if (isAuthPage) {
  // Hide everything except Home
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (!link.getAttribute("href").includes("index.html")) {
      link.style.display = "none";
    }
  });

  document.querySelector(".nav-right")?.style.setProperty("display", "none");
}

    document.body.insertAdjacentHTML("afterbegin", html);

    auth.onAuthStateChanged(user => {
      document
        .querySelectorAll(".auth-only")
        .forEach(el => el.style.display = user ? "inline-block" : "none");

      document
        .querySelectorAll(".guest-only")
        .forEach(el => el.style.display = user ? "none" : "inline-block");

      if (user?.email === "idea2play2@gmail.com") {
        document.querySelectorAll(".admin-only")
          .forEach(el => el.style.display = "inline-block");
      }
    });

    document.getElementById("logoutBtn")?.addEventListener("click", async () => {
      await signOut(auth);
      location.href = "/index.html";
    });
  });
