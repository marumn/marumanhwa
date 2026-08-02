function loadTab(){

fetch("../components/tab.html")

.then(response => response.text())

.then(data => {

document.getElementById("tab-container").innerHTML = data;

});

}



function toggleMenu(){

document
.getElementById("sidebar")
.classList.toggle("active");

}



loadTab();
