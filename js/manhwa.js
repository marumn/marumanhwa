let manhwa = [];


fetch("../data/manhwa.json")
.then(response => response.json())
.then(data => {

    manhwa = data;

});


function searchManhwa(){

    let input =
    document.getElementById("searchInput")
    .value.toLowerCase();


    let results =
    document.getElementById("searchResults");


    results.innerHTML="";


    manhwa.forEach(item => {


        if(
            item.title.toLowerCase()
            .includes(input)
            &&
            input !== ""
        ){

            results.innerHTML += `

            <div class="search-result"
            onclick="location.href='${item.link}'">

            ${item.title}

            </div>

            `;

        }

    });

}
