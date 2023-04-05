import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZnXDWPAbkzJmCdN7uymZbNE6EwKTcX0I",
  authDomain: "wartify-9f052.firebaseapp.com",
  projectId: "wartify-9f052",
  storageBucket: "wartify-9f052.appspot.com",
  messagingSenderId: "989566771535",
  appId: "1:989566771535:web:ddcb33f15843c93ab4e53a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;