import { initializeApp } 
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


import { getFirestore }
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBuSkc3-fGy0kHV2_D3eVNNYkFkG2LWnbg",
  authDomain: "maru-manhwa.firebaseapp.com",
  projectId: "maru-manhwa",
  storageBucket: "maru-manhwa.firebasestorage.app",
  messagingSenderId: "431200871834",
  appId: "1:431200871834:web:468b9b694099c87587c623"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const db = getFirestore(app);
