
  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPJ8JXk0a25awUVK3QBxDl_wvBl5MG45c",
  authDomain: "trackray-96689.firebaseapp.com",
  projectId: "trackray-96689",
  storageBucket: "trackray-96689.firebasestorage.app",
  messagingSenderId: "483367747512",
  appId: "1:483367747512:web:7bac447579e865d893d94d",
  measurementId: "G-NKC4MB73WE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  export const db = getFirestore(app);