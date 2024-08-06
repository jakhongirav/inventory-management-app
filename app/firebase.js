import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjbhPqWYX0-KPCEbF-Fen6U5T9-f_L0NM",
  authDomain: "inventory-management-app-c6637.firebaseapp.com",
  projectId: "inventory-management-app-c6637",
  storageBucket: "inventory-management-app-c6637.appspot.com",
  messagingSenderId: "411354922856",
  appId: "1:411354922856:web:f9f9519d948a65850e20dd",
  measurementId: "G-JB5Y8G56SK",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export const auth = getAuth(app);
export { firestore };
