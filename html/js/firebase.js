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

const firebaseConfig = {
    apiKey: "AIzaSyDjwcAdI0ml4Ckb26ti0PXPnbqquQj5MYo",
    authDomain: "idea2play-7a07c.firebaseapp.com",
    projectId: "idea2play-7a07c",
    storageBucket: "idea2play-7a07c.firebasestorage.app",
    messagingSenderId: "964404277928",
    appId: "1:964404277928:web:f448285bbe6819d99e089d",
    measurementId: "G-QXV84VBD34"
  };

const app = initializeApp(firebaseConfig););

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