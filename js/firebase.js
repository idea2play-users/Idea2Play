import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const register = async (email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    createdAt: serverTimestamp()
  });

  return cred;
};
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp({
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID"
});

export const auth = getAuth(app);

export const login = (e,p)=>signInWithEmailAndPassword(auth,e,p);
export const register = (e,p)=>createUserWithEmailAndPassword(auth,e,p);
export const logout = ()=>signOut(auth);

export const protectPage = ()=>onAuthStateChanged(auth,u=>{
  if(!u) location.href="login.html";
});

export const protectAdmin = ()=>onAuthStateChanged(auth,u=>{
  if(!u || u.email!=="idea2play2@gmail.com") location.href="index.html";
});

import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const db = getFirestore();