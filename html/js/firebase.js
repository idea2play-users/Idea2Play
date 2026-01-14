import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjwcAdI0ml4Ckb26ti0PXPnbqquQj5MYo",
  authDomain: "idea2play-7a07c.firebaseapp.com",
  projectId: "idea2play-7a07c",
  storageBucket: "idea2play-7a07c.appspot.com",
  messagingSenderId: "964404277928",
  appId: "1:964404277928:web:f448285bbe6819d99e089d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerUser = async (email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    createdAt: serverTimestamp()
  });
  return cred;
};

export const logoutUser = () => signOut(auth);

export const protectPage = () =>
  onAuthStateChanged(auth, u => {
    if (!u) location.href = "./login.html";
  });

export const protectAdmin = () =>
  onAuthStateChanged(auth, u => {
    if (!u || u.email !== "idea2play2@gmail.com") {
      location.href = "./index.html";
    }
  });
