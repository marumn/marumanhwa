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

    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.toggle("active");
    }

};


/* ================= MANGA ================= */

const mangaId = window.mangaId;

if (!mangaId) {

    console.error("mangaId is missing!");

}


/* ================= REACTION DATA ================= */

const reactionRef = doc(
    db,
    "reactions",
    mangaId
);


/* ================= REACT ================= */

window.react = async function (type) {

    console.log("Reaction clicked:", type);


    // Not logged in
    if (!auth.currentUser) {

    window.location.href = "/login/";

    return;

}


if (!auth.currentUser.emailVerified) {

    await signOut(auth);

    alert("Please verify your email before reacting.");

    window.location.href = "/login/";

    return;

}


    try {

        const uid = auth.currentUser.uid;

        const snap = await getDoc(reactionRef);


        let data = snap.exists()
            ? snap.data()
            : {};


        // Make sure all three reactions are arrays
        if (!Array.isArray(data.like)) {
            data.like = [];
        }

        if (!Array.isArray(data.love)) {
            data.love = [];
        }

        if (!Array.isArray(data.fire)) {
            data.fire = [];
        }


        if (!data[type]) {

            console.error("Invalid reaction type:", type);

            return;

        }


        // Already reacted → remove reaction
        if (data[type].includes(uid)) {

            data[type] = data[type].filter(
                id => id !== uid
            );

        }

        // Not reacted → add reaction
        else {

            data[type].push(uid);

        }


        await setDoc(
            reactionRef,
            data
        );


        await loadReactions();


    }

    catch (error) {

        console.error("Reaction error:", error);

        alert("Something went wrong with the reaction.");

    }

};


/* ================= LOAD REACTIONS ================= */

async function loadReactions() {

    try {

        const snap = await getDoc(reactionRef);


        let data = snap.exists()
            ? snap.data()
            : {};


        const likes = Array.isArray(data.like)
            ? data.like.length
            : 0;


        const loves = Array.isArray(data.love)
            ? data.love.length
            : 0;


        const fires = Array.isArray(data.fire)
            ? data.fire.length
            : 0;


        document.getElementById("likeCount").textContent =
            likes;


        document.getElementById("loveCount").textContent =
            loves;


        document.getElementById("fireCount").textContent =
            fires;


    }

    catch (error) {

        console.error("Could not load reactions:", error);

    }

}


/* Load counts immediately */
loadReactions();


/* ================= LOGOUT ================= */

window.logout = async function () {

    try {

        await signOut(auth);

    }

    catch (error) {

        console.error("Logout error:", error);

    }

};


/* ================= AUTH STATE ================= */

onAuthStateChanged(auth, async (user) => {

    const panel =
        document.getElementById("userPanel");


    const loginBtn =
    document.getElementById("loginLink");


    if (!panel) {
        return;
    }


    /* ================= LOGGED IN ================= */

    if (user && !user.emailVerified) {

    await signOut(auth);

    panel.innerHTML = "";

  if (loginBtn) {
    loginBtn.style.setProperty("display", "flex", "important");
}

    return;

}

if (user) {

      if (loginBtn) {
    loginBtn.style.setProperty("display", "none", "important");
}


        try {

            const snap = await getDoc(
                doc(db, "users", user.uid)
            );


            let data = snap.exists()
                ? snap.data()
                : {};


            const username =
                data.username || "User";


            const profilePic =
                data.profilePic || "/assets/profile.png";


            panel.innerHTML = `

                <div class="user-info">

                    <img
                        src="${profilePic}"
                        alt="Profile"
                    >

                    <div>

                        <strong>${username}</strong>

                        <br>

                        Logged in

                    </div>

                </div>

                <button
                    class="logout-btn"
                    onclick="logout()"
                >
                    Logout
                </button>

            `;

        }

        catch (error) {

            console.error(
                "Could not load user profile:",
                error
            );

        }

    }


    /* ================= LOGGED OUT ================= */

    else {

        panel.innerHTML = "";


        if (loginBtn) {
            loginBtn.style.display = "block";
        }

    }

});
