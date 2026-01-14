import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let chatHistory = [];

send.onclick = async () => {
  if (!msg.value) return;

  const text = msg.value;
  msg.value = "";

  chat.innerHTML += `<div class="chat-bubble user">${text}</div>`;
  chatHistory.push({ role: "user", content: text });

  const res = await fetch("/api/aiChat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: chatHistory })
  });

  const data = await res.json();

  if (data.reply) {
    chat.innerHTML += `<div class="chat-bubble ai">${data.reply}</div>`;
    chatHistory.push({ role: "assistant", content: data.reply });
  }
};

save.onclick = async () => {
  if (!auth.currentUser) return;

  await addDoc(collection(db, "projects"), {
    ownerId: auth.currentUser.uid,
    title: title.value || "Untitled Project",
    chat: chatHistory,
    published: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  alert("Project saved!");
};
