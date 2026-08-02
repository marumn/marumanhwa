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



function loadTab(){


fetch("../components/tab.html")


.then(response => response.text())


.then(data=>{


document
.getElementById("tab-container")
.innerHTML=data;


watchUser();


});


}



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


<p style="
color:#ff2e63;
font-weight:bold;
margin-bottom:10px;
">
👤 ${username}
</p>



<a href="../profile">
Profile
</a>



<a href="#" onclick="logoutUser()">
Logout
</a>


`;



}

else{



account.innerHTML=`


<a href="../login">
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



loadTab();
