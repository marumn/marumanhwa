iimport { auth, db } from "./firebase.js";


import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


import {
doc,
setDoc,
getDoc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

/* 🔥 FIREBASE */


const chapterId = window.mangaId;

/* ================= LOGIN UI ================= */

const modal = document.getElementById("loginModal");

let registerMode = false;

const modalTitle = document.getElementById("modalTitle");
const usernameInput = document.getElementById("username");
const submitBtn = document.getElementById("submitBtn");
const switchText = document.getElementById("switchText");

document.getElementById("openLogin").onclick = () => {
    modal.style.display = "flex";
};

document.getElementById("closeModal").onclick = () => {
    modal.style.display = "none";
};

function updateModal(){

    if(registerMode){

        modalTitle.textContent = "Register";
        usernameInput.style.display = "block";
        submitBtn.textContent = "Register";

        switchText.innerHTML = `
        Already have an account?
        <span id="switchMode" style="color:#ff2e63;cursor:pointer;font-weight:bold;">
        Login here
        </span>`;

    }else{

        modalTitle.textContent = "Login";
        usernameInput.style.display = "none";
        submitBtn.textContent = "Login";

        switchText.innerHTML = `
        Don't have an account?
        <span id="switchMode" style="color:#ff2e63;cursor:pointer;font-weight:bold;">
        Register here
        </span>`;
    }

    document.getElementById("switchMode").onclick = () => {
        registerMode = !registerMode;
        updateModal();
    };
}

updateModal();

window.login = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await signInWithEmailAndPassword(auth,email,password);
};

window.register = async () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userCred = await createUserWithEmailAndPassword(auth,email,password);

    await setDoc(doc(db,"users",userCred.user.uid),{
        username,
        profilePic: "/assets/profile.png"
    });
};

submitBtn.onclick = async () => {

    try{

        if(registerMode){
            await register();
        }else{
            await login();
        }

        alert("Success!");

        modal.style.display = "none";

    }
    catch(error){

        alert(error.message);

    }

};

    modal.style.display = "none";
};

window.logout = async () => {
    await signOut(auth);
};

/* ================= REACTIONS ================= */

const reactionRef = doc(db, "reactions", chapterId);

window.react = async function(type){

  if(!auth.currentUser) return alert("Login first");

  const uid = auth.currentUser.uid;

  const snap = await getDoc(reactionRef);

  let data = snap.exists() ? snap.data() : {
    like: [],
    love: [],
    fire: []
  };

  if(data[type].includes(uid)){
    data[type] = data[type].filter(x => x !== uid);
  } else {
    data[type].push(uid);
  }

  await setDoc(reactionRef, data);
  loadReactions();
};

async function loadReactions(){
  const snap = await getDoc(reactionRef);

  const data = snap.exists() ? snap.data() : {
    like: [],
    love: [],
    fire: []
  };

  document.getElementById("likeCount").innerText = data.like.length;
  document.getElementById("loveCount").innerText = data.love.length;
  document.getElementById("fireCount").innerText = data.fire.length;
}

loadReactions();

  onAuthStateChanged(auth, async(user)=>{

    const panel=document.getElementById("userPanel");
    const loginBtn=document.getElementById("openLogin");

    if(user){

        loginBtn.style.display="none";

        const snap=await getDoc(doc(db,"users",user.uid));
        const data=snap.data();

        panel.innerHTML=`
            <div class="user-info">
                <img src="${data.profilePic}">
                <div>
                    <strong>${data.username}</strong><br>
                    Logged in
                </div>
            </div>

            <button class="logout-btn" onclick="logout()">
                Logout
            </button>
        `;

    }else{

        panel.innerHTML="";
        loginBtn.style.display="block";

    }

}); 
