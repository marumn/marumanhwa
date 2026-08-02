import { auth, db } from "./firebase.js";


import {
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


import {
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


function toggleMenu(){


document
.getElementById("sidebar")
.classList.toggle("active");


}


window.toggleMenu = toggleMenu;




function watchUser(){


onAuthStateChanged(auth, async(user)=>{


let account =
document.getElementById("account-area");



if(!account) return;



if(user){



let username="User";



const userData =
await getDoc(
doc(db,"users",user.uid)
);



if(userData.exists()){


username =
userData.data().username;


}




account.innerHTML=`

<div style="
display:flex;
align-items:center;
justify-content:space-between;
gap:10px;
">


<div style="
display:flex;
align-items:center;
gap:10px;
">


<img 
src="../assets/profile.png"
style="
width:40px;
height:40px;
border-radius:50%;
object-fit:cover;
">


<span style="
color:white;
font-weight:bold;
">

${username}

</span>


</div>



<button
onclick="logoutUser()"
style="
background:#ff2e63;
border:none;
color:white;
padding:8px 12px;
border-radius:8px;
cursor:pointer;
">

Logout

</button>


</div>

`;


}

else{



account.innerHTML=`


<a href="/login">
🔑 Login
</a>


`;



}



});


}




window.logoutUser = async function(){


await signOut(auth);


location.reload();


}



console.log("tab.js loaded");

function loadTab(){

    console.log("Loading tab...");

    fetch("/components/tab.html")

    .then(response => {
        console.log("Fetch status:", response.status);
        return response.text();
    })

    .then(data => {

        console.log("Tab loaded!");

        document
        .getElementById("tab-container")
        .innerHTML = data;

        watchUser();

    })

    .catch(error => {
        console.error(error);
    });

}

loadTab();
