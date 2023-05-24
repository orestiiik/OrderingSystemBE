import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCkAUcRwCL10LhUbycMJdg9GOA0BaPd9MY",
    authDomain: "ordersystem-orderwise.firebaseapp.com",
    projectId: "ordersystem-orderwise",
    storageBucket: "ordersystem-orderwise.appspot.com",
    messagingSenderId: "364521972464",
    appId: "1:364521972464:web:da767442b3a038e766d835",
    measurementId: "G-MZG0TDV59M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);