import {auth, db} from "./firebase.js";


import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
sendPasswordResetEmail,
signOut
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
setDoc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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


const result = await createUserWithEmailAndPassword(
auth,
email,
password
);



await setDoc(
    doc(db, "users", result.user.uid),
    {
        username: username,
        profilePic: "/assets/profile.png"
    }
);



alert("Account created!");


const params = new URLSearchParams(window.location.search);
const returnUrl = params.get("return");

if (returnUrl) {
    location.href = returnUrl;
} else {
    location.href = "/home";
}



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


const params = new URLSearchParams(window.location.search);
const returnUrl = params.get("return");

if (returnUrl) {
    location.href = returnUrl;
} else {
    location.href = "/home";
}



}
catch(error){

alert(error.message);

}


}




window.logoutUser = async function(){


await signOut(auth);


location.reload();


}

window.forgotPassword = async function(){

    let email =
    document.getElementById("email").value.trim();


    if(!email){

        alert("Please enter your email first.");

        return;

    }


    try{

        await sendPasswordResetEmail(
            auth,
            email
        );


        alert(
            "Password reset email sent! Check your email."
        );


    }
    catch(error){

        alert(error.message);

    }

}
