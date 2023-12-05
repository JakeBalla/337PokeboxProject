/**
 * Authors: Jake Balla, Cesar Perez, Audrina Campa, Chris Machado
 * Purpose: This file is the script for the box page. This includes the following:
 * 1) Inputting the appropriate Pokemon to display on the boxpage
 * 2) Delete Pokemon on right click
 * 3) Drag and drop Pokemon to reorder
 * 4) Displaying the Pokemon's information on hover
 * 5) Implement friends box viewing
 * 6) Buttons to go back, add Pokemon, and import box
 */
let glob = null; // Global variable for data
let draggedPokemon; // Variable to store the dragged Pokémon data
let boxNumber = 0; // Current viewed box
let myBoxNumber = 0; // Current box loaded for user
let isOwner = true; // User is the owner of box
let link = "https://pokebox.live";

if(localStorage.getItem('boxNumber')){ // Get from storage if available
    boxNumber = localStorage.getItem('boxNumber');
}
if(localStorage.getItem('myBoxNumber')){
    myBoxNumber = localStorage.getItem('myBoxNumber');
}

function loadBox(){
    /**
     * This functon will load the box data from the server and display it
     */
    document.getElementById('boxNumber').innerHTML = 'Box ' + boxNumber; // Update box number
    let user = localStorage.getItem('username'); // Get current user
    if(!isOwner){
        user = localStorage.getItem('fromUser'); // Friend box then grab it
    }
    fetch(link + '/get/box/' + user + '/' + boxNumber) // Call server
    .then((res) =>{
        return res.json();
    }).then((data) =>{
        glob = data; // Store data in file for instant access
        showResults(data); // Display data
    });
}

window.addEventListener('load', () => {
    /**
     * This loads a user box when the page is loaded.
     */
    loadBox();
});

function showResults(data){
    /**
     * This function will display all pokemon that match the search criteria.
     * This should include sprites, names, and types.
     */
    let result = ''; // Result to be displayed
    for(let i = 0; i < data.length; i ++){
        let pokemon = data[i];
        result += "<div class='pokemon'  onmouseover='updateInfo(\"" + i + "\")' oncontextmenu='handleRightClick(event, \"" + i + "\")'>"; // Store index in handlers
        result += "<h1>";
        result += "<a href='" + link + "/pokemon.html' onclick='store(\"" + i + "\")'>" + firstUpperCase(pokemon.name) + "</a>"; // Make uppercase, store index in handler
        result += "</h1>";
        let img = './img/' + pokemon.sprite;
        result += "<img class='sprite' draggable='true' ondragstart='drag(event)'data-index = '" + i + "' src='" + img + "' alt='" + pokemon.name + "'/>"; // Allow for dragging 
        result += '<div class="stats">';
        result += showGen(pokemon.generation);
        result += showTypes(pokemon.types);
        result += '</div>';
        result += '</div>';
    }
    result += '';
    document.getElementById('boxTab').innerHTML = result; // Display result
}

function handleRightClick(event, index) {
    event.preventDefault(); // Prevent the default right click menu from appearing
    glob.splice(index, 1); // Delete the Pokemon from glob and shift elements to the left
    showResults(glob); // Display new swap
    if(isOwner){
        updateServer(glob); // Update server if owner
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
        let img = './img/types/' + type + '.png'; // Get appropriae image link
        result += "<img src='" + img + "' alt='" + type + "'/>";
    }
    result += "</span>";
    return result;
}

function showGen(gen){
    /**
     * This function will show the generation of the pokemon.
     */
    let img = './img/gens/' + gen + '.png'; // Get appropriate image link
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
    /**
     * This function will update the information displayed on the left side of the page.
     */
    document.getElementById('infoSprite').src = './img/' + glob[num].sprite;
    processStats(glob[num]);
}

function processStats(pokemon){
    /**
     * This function will process the stats of the pokemon and display them on the page.
     */

    // Grab all the elements
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
    // Place elements
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
    growthRate.innerText = firstUpperCase(pokemon.growth_rate);
    // Display elements if not already
    document.getElementById('list').style.display = 'block';
    document.getElementById('infoSprite').style.visibility = 'visible';
}

function processCatchPercent(string){
    /**
     * This function will process the catch percent and display it on the page.
     */
    let number = parseInt(string);
    number.toFixed(2); // Make int 2 decimal places
    let result = number + "%"; // Make string with percent
    return result;
}

document.getElementById('previous').addEventListener('click', () =>{ 
    /**
     * This function will load the previous box.
     */
    if(boxNumber > 0){ // 0 we can't go more to the left
        boxNumber--;
        localStorage.setItem('boxNumber', boxNumber); // Update view box
        if(isOwner){ // Owner then also update current box
            myBoxNumber= boxNumber;
            localStorage.setItem('myBoxNumber', myBoxNumber);
        }
        loadBox();
    }
});

document.getElementById('next').addEventListener('click', () =>{
    /**
     * This function will load the next box.
     */
    if(boxNumber < 9){ // Only 0-9 boxes
        boxNumber++;
        localStorage.setItem('boxNumber', boxNumber); // Update view box
        if(isOwner){ // Owner then also update current box
            myBoxNumber= boxNumber;
            localStorage.setItem('myBoxNumber', myBoxNumber);
        }
        loadBox();
    }
});

function add(){
    /**
     * This function will redirect to the search html page.
     */
    window.location.href = 'search.html';
}

function drag(event) {
    /**
     * This function is called when the user starts dragging a Pokémon
     */
    const index = event.target.getAttribute('data-index'); // Get drag index
    draggedPokemon = glob[index]; // Store dragged pokemon
    draggedPokemonIndex = index; // Store index
}

function allowDrop(event) {
    /**
     * This allows for a drop to occur.
     */
    event.preventDefault();
}

function drop(event) {
    /**
     * This function is called when the user drops a Pokémon
     */
    event.preventDefault(); // Prevent the default behavior
    let dropIndex = event.target.getAttribute('data-index'); // Get index of Pokemon being dropped on
    if (draggedPokemon && dropIndex !== null) { // Swap the positions of the dragged Pokémon and the drop target Pokémon
        const dropTargetPokemon = glob[dropIndex];
        glob[dropIndex] = draggedPokemon;
        glob[draggedPokemonIndex] = dropTargetPokemon;
        showResults(glob); // Update the display
        if(isOwner){
            updateServer(glob); // Update server if owner
        }
    }
    draggedPokemon = null; // Reset variable
}

// Add the "ondragover" and "ondrop" attributes to the container where Pokémon divs are dropped
document.getElementById('boxTab').setAttribute('ondragover', 'allowDrop(event)');
document.getElementById('boxTab').setAttribute('ondrop', 'drop(event)');

function updateServer(glob){
    /**
     * This function will update the server with the new box data.
     */
    let data = glob.map(pokemon => pokemon.name); // Get only the names of Pokemon
    fetch(link + '/update/box/' + localStorage.getItem('username') + '/' + boxNumber, { // Send to server
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function friendSearch(event, keyPressed){
    /**
     * This function will search for a friends box.
     */
    if(keyPressed !== 'Enter'){ // Ignore if not enter
        return;
    }
    let friend = document.getElementById('friendSearch').value; // Get input
    fetch(link + '/get/box/' + friend + '/' + '0')
    .then((res) =>{
        return res.json();
    }).then((data) =>{
        localStorage.setItem('fromUser', friend); // Store friend
        glob = data; // New display data
        isOwner = false; // No longer owner
        boxNumber = 0; // Default to box 0
        document.getElementById('boxNumber').innerHTML = "Box 0"; // Reset box number
        viewButtons(); // Display buttons for firend box
        showResults(data); 
    })
    .catch(() =>{
        window.alert('No user found');
    });
}

function viewButtons(){
    /**
     * This swaps the buttons based on if we are viewing a friends box or not.
     */
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
    /**
     * This function takes a user back to their box
     */
    isOwner = true; // Owner again
    boxNumber = myBoxNumber; // Go back to their box
    document.getElementById('boxNumber').innerHTML = 'Box ' + boxNumber; // Update box number
    viewButtons();
    loadBox();
}

function importBox(){
    /**
     * This function will import a friends box ro the users box.
     */
    let url = link + '/import/box/' + localStorage.getItem('fromUser') + '/' + boxNumber + '/' + localStorage.getItem('username') + '/' + myBoxNumber;
    let p = fetch(url).then( () => {
        window.alert('Box Imported Sucessfully');
    })
    .catch(() =>{
        window.alert('Box Failed to Import');
    });
}