import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


/* ================= MENU ================= */

window.toggleMenu = function () {
    document.getElementById("sidebar").classList.toggle("active");
};


/* ================= MANGA ================= */

const mangaId = window.mangaId;


/* ================= REACTIONS ================= */

const reactionRef = doc(
    db,
    "reactions",
    mangaId
);


window.react = async function(type) {

    // Not logged in → go to login page
    if (!auth.currentUser) {
        window.location.href = "/login/";
        return;
    }

    const uid = auth.currentUser.uid;

    const snap = await getDoc(reactionRef);

    let data = snap.exists()
        ? snap.data()
        : {
            like: [],
            love: [],
            fire: []
        };


    // Make sure arrays exist
    data.like = data.like || [];
    data.love = data.love || [];
    data.fire = data.fire || [];


    if (data[type].includes(uid)) {

        // Remove reaction
        data[type] = data[type].filter(
            x => x !== uid
        );

    } else {

        // Add reaction
        data[type].push(uid);

    }


    await setDoc(
        reactionRef,
        data
    );


    loadReactions();

};


/* ================= LOAD REACTIONS ================= */

async function loadReactions() {

    const snap = await getDoc(reactionRef);

    const data = snap.exists()
        ? snap.data()
        : {
            like: [],
            love: [],
            fire: []
        };


    document.getElementById("likeCount").innerText =
        (data.like || []).length;

    document.getElementById("loveCount").innerText =
        (data.love || []).length;

    document.getElementById("fireCount").innerText =
        (data.fire || []).length;

}


loadReactions();


/* ================= LOGOUT ================= */

window.logout = async function() {

    await signOut(auth);

};


/* ================= AUTH STATE ================= */

onAuthStateChanged(auth, async (user) => {

    const panel = document.getElementById("userPanel");
    const loginBtn = document.querySelector(".login-btn");


    if (!panel) return;


    if (user) {

        // Hide login button
        if (loginBtn) {
            loginBtn.style.display = "none";
        }


        const snap = await getDoc(
            doc(db, "users", user.uid)
        );


        if (!snap.exists()) {

            console.error("User profile not found");

            return;

        }


        const data = snap.data();


        panel.innerHTML = `

            <div class="user-info">

                <img src="${data.profilePic || "/assets/profile.png"}">

                <div>

                    <strong>${data.username || "User"}</strong>

                    <br>

                    Logged in

                </div>

            </div>


            <button class="logout-btn" onclick="logout()">
                Logout
            </button>

        `;


    } else {

        // Not logged in
        panel.innerHTML = "";

        if (loginBtn) {
            loginBtn.style.display = "block";
        }

    }

});
