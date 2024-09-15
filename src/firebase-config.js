import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCo26BbMRrEgcbO_3aRXxxhxS1HXnoPSBQ",
  authDomain: "bj-21-xx-plus.firebaseapp.com",
  projectId: "bj-21-xx-plus",
  storageBucket: "bj-21-xx-plus.appspot.com",
  messagingSenderId: "663096390182",
  appId: "1:663096390182:web:49493d3b679a6bbfa0ace7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()
export const storage = getStorage(app)
export const db = getFirestore(app)