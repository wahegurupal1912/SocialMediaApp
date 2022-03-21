import { initializeApp } from 'firebase/app';
import admin from 'firebase-admin';
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from './config.js';

admin.initializeApp();
const firebase = initializeApp(firebaseConfig);

export { admin };
export const db = getFirestore(firebase);
