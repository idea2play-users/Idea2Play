import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let chatHistory = [];

send.onclick = () => {
  if (!msg.value) return;

  chat.innerHTML += <div class="chat-bubble user">${msg.value}</div>;
  chatHistory.push({ role: "user", text: msg.value });

  msg.value = "";

  setTimeout(() => {
    const aiText = "Tell me more about the gameplay.";
    chat.innerHTML += <div class="chat-bubble ai">${aiText}</div>;
    chatHistory.push({ role: "ai", text: aiText });
  }, 500);
};

save.onclick = async () => {
  if (!auth.currentUser) {
    alert("Please log in to save projects.");
    return;
  }

  await addDoc(collection(db, "projects"), {
    ownerId: auth.currentUser.uid,
    title: title.value || "Untitled Project",
    chat: chatHistory,
    image: "",
    published: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  alert("Project saved!");
};