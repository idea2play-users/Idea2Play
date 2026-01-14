function showThinking() {
  const el = document.createElement("div");
  el.id = "thinking";
  el.className = "chat-bubble ai thinking";
  el.innerText = "AI is thinking...";
  chat.appendChild(el);
}

function hideThinking() {
  document.getElementById("thinking")?.remove();
}

import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let chatHistory = [];

send.onclick = () => {
  if (!msg.value) return;

  send.onclick = async () => {
  if (!msg.value) return;

  const userMessage = msg.value;

  // UI: user bubble
  chat.innerHTML += `<div class="chat-bubble user">${userMessage}</div>`;
  chatHistory.push({ role: "user", content: userMessage });
  msg.value = "";


  const thinking = document.createElement("div");
  thinking.className = "chat-bubble ai";
  thinking.innerText = "Thinking...";
  chat.appendChild(thinking);

 send.disabled = true;
msg.disabled = true;
showThinking();

  const res = await fetch("/api/aiChat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: chatHistory,
      generateImage: chatHistory.length >= 4, // generate image later
    }),
  });

  const data = await res.json();
  {
  "reply": "...",
  "missingFields": [],
  "readyToSubmit": false,
  "gameData": { ... }
}


  thinking.remove();

if (data.reply) {
  chat.innerHTML += `
    <div class="chat-bubble ai">
      ${data.reply}
    </div>
  `;
  chatHistory.push({
    role: "assistant",
    content: data.reply
  });
}

  // AI reply
  if (data.readyToSubmit) {
  chat.innerHTML += `
    <div class="confirm-box">
      <p>Are you ready to submit your game idea?</p>
      <button id="yesSubmit">Yes</button>
      <button id="noSubmit">Not yet</button>
    </div>
  `;

  document.getElementById("yesSubmit").onclick = () => {
    sendAI(true);
    await fetch("/api/sendGameReport", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    gameData: data.gameData,
    imageUrl: data.imageUrl,
    userEmail: auth.currentUser?.email || "Guest",
  }),
});

  };

  document.getElementById("noSubmit").onclick = () => {
    chatHistory.push({
      role: "user",
      content: "Not yet, let's continue refining the idea."
    });
  };
}

  // SAVE TO FIRESTORE IF EDITING
  if (projectId && auth.currentUser) {
    await updateDoc(doc(db, "projects", projectId), {
      chat: chatHistory,
      image: data.imageUrl || "",
      updatedAt: new Date(),
    });
  }
};

  await addDoc(collection(db, "projects"), {
    ownerId: auth.currentUser.uid,
    title: title.value || "Untitled Project",
    chat: chatHistory,
    image: "",
    published: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
image: ""
  alert("Project saved!");
};