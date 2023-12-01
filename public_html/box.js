let glob = null; // Global variable for data
let draggedPokemon; // Variable to store the dragged Pokémon data
let boxNumber = 0;
let myBoxNumber = 0;
let isOwner = true;
let link = "http://127.0.0.1";
if(localStorage.getItem('boxNumber')){
    boxNumber = localStorage.getItem('boxNumber');
}
if(localStorage.getItem('myBoxNumber')){
    myBoxNumber = localStorage.getItem('myBoxNumber');
}

function loadBox(){
    document.getElementById('boxNumber').innerHTML = 'Box ' + boxNumber;
    let user = localStorage.getItem('username');
    if(!isOwner){
        user = localStorage.getItem('fromUser');
    }
    fetch(link + '/get/box/' + user + '/' + boxNumber)
    .then((res) =>{
        return res.json();
    }).then((data) =>{
        glob = data;
        showResults(data);
    });
}

window.addEventListener('load', () => {
    loadBox();
});

function showResults(data){
    /**
     * This function will display all pokemon that match the search criteria.
     * This should also include type and generation
     */
    let result = '';
    for(let i = 0; i < data.length; i ++){
        let pokemon = data[i];
        result += "<div class='pokemon'  onmouseover='updateInfo(\"" + i + "\")' oncontextmenu='handleRightClick(event, \"" + i + "\")'>";
        result += "<h1>";
        result += "<a href='" + link + "/pokemon.html' onclick='store(\"" + i + "\")'>" + firstUpperCase(pokemon.name) + "</a>";
        result += "</h1>";
        let img = './img/' + pokemon.sprite;
        result += "<img class='sprite' draggable='true' ondragstart='drag(event)'data-index = '" + i + "' src='" + img + "' alt='" + pokemon.name + "'/>";
        result += '<div class="stats">';
        result += showGen(pokemon.generation);
        result += showTypes(pokemon.types);
        result += '</div>';
        result += '</div>';
    }
    result += '';
    document.getElementById('boxTab').innerHTML = result; // Clear search fields
}

function handleRightClick(event, index) {
    event.preventDefault();

    // Delete the Pokemon from glob and shift elements to the left
    glob.splice(index, 1);
    showResults(glob);
    if(isOwner){
        updateServer(glob);
    }
}

function firstUpperCase(str) {
    /**
     * This function will capitalize the first letter of a string.
     */
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showTypes(types){
    /**
     * This function will show the types of the pokemon.
     */
    let result = "<span class='types'>";
    for(let type of types){
        let img = './img/types/' + type + '.png';
        result += "<img src='" + img + "' alt='" + type + "'/>";
    }
    result += "</span>";
    return result;
}

function showGen(gen){
    /**
     * This function will show the generation of the pokemon.
     */
    let img = './img/gens/' + gen + '.png';
    return "<img class='gen' src='" + img + "' alt='" + gen + "'/>";
}

function store(num){
    /**
     * This function will store the selected pokemon data in local storage before moving to the result.
     * While this technique may be a little unconvential, it does allow us to reduce server calls.
     */
    localStorage.setItem('pokemon',JSON.stringify(glob[num]));
}

function updateInfo(num){
    document.getElementById('infoSprite').src = './img/' + glob[num].sprite;
    processStats(glob[num]);
}

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function processStats(pokemon){
    let weight = document.getElementById('weight');
    let height = document.getElementById('height');
    let baseExperience = document.getElementById('base_experience');
    let id = document.getElementById('id');
    let hp = document.getElementById('hp');
    let attack = document.getElementById('attack');
    let defense = document.getElementById('defense');
    let specialAttack = document.getElementById('special_attack');
    let specialDefense = document.getElementById('special_defense');
    let speed = document.getElementById('speed');
    let catchPercent = document.getElementById('catch_percent');
    let growthRate = document.getElementById('growth_rate');

    id.innerText = pokemon.id;
    baseExperience.innerText = pokemon.base_experience;
    height.innerText = pokemon.height;
    hp.innerHTML = pokemon.hp;
    attack.innerHTML = pokemon.attack;
    defense.innerHTML = pokemon.defense;
    weight.innerText = pokemon.weight;
    specialAttack.innerText = pokemon.special_attack;
    specialDefense.innerText = pokemon.special_defense;
    speed.innerText = pokemon.speed;
    weight.innerText = pokemon.weight;
    catchPercent.innerText = processCatchPercent(pokemon.catch_percent);
    growthRate.innerText = upperCaseFirstLetter(pokemon.growth_rate);

    document.getElementById('list').style.display = 'block';
    document.getElementById('infoSprite').style.visibility = 'visible';
}

function processCatchPercent(string){
    let number = parseInt(string);
    number.toFixed(2);
    let result = number + "%";
    return result;
}

document.getElementById('previous').addEventListener('click', () =>{ 
    console.log('hello');
    if(boxNumber > 0){
        boxNumber--;
        localStorage.setItem('boxNumber', boxNumber);
        if(isOwner){
            myBoxNumber= boxNumber;
            localStorage.setItem('myBoxNumber', myBoxNumber);
        }
        loadBox();
    }
});

document.getElementById('next').addEventListener('click', () =>{
    if(boxNumber < 9){
        boxNumber++;
        localStorage.setItem('boxNumber', boxNumber);
        if(isOwner){
            myBoxNumber= boxNumber;
            localStorage.setItem('myBoxNumber', myBoxNumber);
        }
        loadBox();
    }
});

function add(){
    window.location.href = 'search.html';
}

function drag(event) {
    // Set the dragged Pokémon data when dragging starts
    const index = event.target.getAttribute('data-index');
    draggedPokemon = glob[index];
    draggedPokemonIndex = index;
}

function allowDrop(event) {
    // Allow the drop event
    event.preventDefault();
}

function drop(event) {
    // Prevent the default drop behavior
    event.preventDefault();

    console.log("testing");

    // Get the index of the drop target Pokémon
    let dropIndex = event.target.getAttribute('data-index');

    // Swap the positions of the dragged Pokémon and the drop target Pokémon
    if (draggedPokemon && dropIndex !== null) {
        const dropTargetPokemon = glob[dropIndex];
        glob[dropIndex] = draggedPokemon;
        glob[draggedPokemonIndex] = dropTargetPokemon;

        // Update the display
        showResults(glob);
        if(isOwner){
            updateServer(glob);
        }
    }

    // Reset the dragged Pokémon variable
    draggedPokemon = null;
}

// Add the "ondragover" and "ondrop" attributes to the container where Pokémon divs are dropped
document.getElementById('boxTab').setAttribute('ondragover', 'allowDrop(event)');
document.getElementById('boxTab').setAttribute('ondrop', 'drop(event)');

function updateServer(glob){
    let data = glob.map(pokemon => pokemon.name);
    fetch(link + '/update/box/' + localStorage.getItem('username') + '/' + boxNumber, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function friendSearch(event, keyPressed){
    if(keyPressed !== 'Enter'){
        return;
    }
    let friend = document.getElementById('friendSearch').value;
    fetch(link + '/get/box/' + friend + '/' + '0')
    .then((res) =>{
        return res.json();
    }).then((data) =>{
        localStorage.setItem('fromUser', friend);
        glob = data;
        isOwner = false;
        boxNumber = 0;
        document.getElementById('boxNumber').innerHTML = "Box 0";
        viewButtons();
        showResults(data);
    })
    .catch(() =>{
        window.alert('No user found');
    });
}

function viewButtons(){
    let result = '';
    if(isOwner){
        result += '<input type="text" id="friendSearch" placeholder="View Friends Box" onkeypress="friendSearch(event, event.key)"></input>';
        result += '<button id="addButton" onclick="add()">Add Pokemon</button>';
    }
    else{
        result += '<button id="importBox" onclick="importBox()">Import Box</button>';
        result += '<button id="back" onclick="back()">Back</button>';
    }
    document.getElementById('boxBG').innerHTML = result;
}

function back(){
    isOwner = true;
    boxNumber = myBoxNumber;
    document.getElementById('boxNumber').innerHTML = 'Box ' + boxNumber;
    viewButtons();
    loadBox();
}

function importBox(){
    let url = link + '/import/box/' + localStorage.getItem('fromUser') + '/' + boxNumber + '/' + localStorage.getItem('username') + '/' + myBoxNumber;
    let p = fetch(url).then( () => {
        window.alert('Box Imported Sucessfully');
    })
    .catch(() =>{
        window.alert('Box Failed to Import');
    });
}