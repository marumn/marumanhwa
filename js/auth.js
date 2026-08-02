import {auth, db} from "./firebase.js";


import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";



window.registerUser = async function(){


let username =
document.getElementById("username").value;


let email =
document.getElementById("email").value;


let password =
document.getElementById("password").value;



if(!username || !email || !password){

alert("Please fill all fields");

return;

}



try{


await createUserWithEmailAndPassword(
auth,
email,
password
);



alert("Account created!");


location.href="../home";



}

catch(error){

alert(error.message);

}


}



window.loginUser = async function(){


let email =
document.getElementById("email").value;


let password =
document.getElementById("password").value;



try{


await signInWithEmailAndPassword(
auth,
email,
password
);



alert("Login successful!");


location.href="../home";



}
catch(error){

alert(error.message);

}


}




window.logoutUser = async function(){


await signOut(auth);


location.reload();


}
