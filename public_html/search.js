/*
    The purpose of Search.js file is to take in the values the user entered to search for a specific Pokemon(s) based on the 
    features selected in the search filters. 

    Returns the Pokemon(s) that follow the user criteria entered on a displayed screen to then select whether the user decides 
    to add the Pokemon to their Box.

*/
let glob = null; // Global variable for data
let link = "https://pokebox.live" // Change this to 127 for local testing

/*
    Stores and displays the Base Experience feature entered by user in the Search page
*/
function bEXP() {
    // gets the value from the slider that is within range
    let b = document.getElementById('base_experience').value;
    // displays the value changing on the site 
    document.getElementById('shiftVal1').innerText = b;
}

/*
    Stores and displays the Height feature entered by user in the Search page 
*/ 
function ht() {
    let h = document.getElementById('height').value;
    document.getElementById('shiftVal2').innerText = h;
}

/*
    Stores and displays the HP feature entered by user in the Search page 
*/ 
function hp() {
    let hp = document.getElementById('hp').value;
    document.getElementById('shiftVal3').innerText = hp;
}

/*
    Stores and displays the Attack feature entered by user in the Search page 
*/ 
function attack() {
    let a = document.getElementById('attack').value;
    document.getElementById('shiftVal4').innerText = a;
}

/*
    Stores and displays the Defense feature entered by user in the Search page 
*/ 
function df() {
    let d = document.getElementById('defense').value;
    document.getElementById('shiftVal5').innerText = d;
}

/*
    Stores and displays the Special Attack feature entered by user in the Search page 
*/ 
function specialAttack() {
    let spA = document.getElementById('special_attack').value;
    document.getElementById('shiftVal6').innerText = spA;
}

/*
    Stores and displays the Special Defense feature entered by user in the Search page 
*/ 
function specialDefense(){
    let sDF = document.getElementById('special_defense').value;
    document.getElementById('shiftVal7').innerText = sDF;
}

/*
    Stores and displays the Speed feature entered by user in the Search page 
*/ 
function sp(){
    let s = document.getElementById('speed').value;
    document.getElementById('shiftVal8').innerText = s;
}

/*
    Stores and displays the Weight feature entered by user in the Search page 
*/ 
function wgt(){
    let w = document.getElementById('weight').value;
    document.getElementById('shiftVal9').innerText = w;
}

/*
    Stores and displays the Percentage ratio of the Pokemon being captured feature entered by user in the Search page 
*/ 
function percent(){
    let p = document.getElementById('catch_percent').value;
    document.getElementById('shiftVal10').innerText = p;
}

function getPokemons() {
    /**
     * This file grabs the appropriate data from the page and processes it to return from the database.
     */
    let container = {}; // Storage
    container['name'] = document.getElementById("nameSearch").value;
    if(container['name'] != null){
        container['name'] = container['name'].toLowerCase(); // Make sure it's lowercase
    }
    container['abilities'] = processText(document.getElementById('abilities').value); // Apply processText on multi-word data

    container['base_experience'] = document.getElementById("base_experience").value;
    container['base_experience'] = numProcess(container['base_experience']); // Apply numprocess for number data

    container['height'] = numProcess(container['height']);
    container['height'] = document.getElementById("height").value;

    container['hp'] = document.getElementById("hp").value;
    container['hp'] = numProcess(container['hp']);

    container['attack'] = document.getElementById("attack").value;
    container['attack'] = numProcess(container['attack']);

    container['defense'] = document.getElementById("defense").value;
    container['defense'] = numProcess(container['defense']);

    container['special_attack'] = document.getElementById("special_attack").value;
    container['special_attack'] = numProcess(container['special_attack']);

    container['special_defense'] = document.getElementById("special_defense").value;
    container['special_defense'] = numProcess(container['special_defense']);

    container['speed'] = document.getElementById("speed").value;
    container['speed'] = numProcess(container['speed']);

    container['weight'] = document.getElementById('weight').value;
    container['weight'] = numProcess(container['weight']);

    container['types'] = processTypes();
    if(container['types'] == 'EXIT'){
        return;
    }

    container['moves'] = processText(document.getElementById('moves').value);

    container['generation'] = document.getElementById('generation').value;
    container['growth_rate'] = document.getElementById('growth_rate').value;

    container['catch_percent'] = numProcess(document.getElementById('catch_percent').value);

    container['legendary'] = document.getElementById('legendary').checked;

    container['mythical'] = document.getElementById('mythical').checked;

    let url = link + '/get/pokemon';
    let p = fetch(url, { // Send to server
        method: 'POST',
        body: JSON.stringify(container),
        headers: {
            'Content-Type': 'application/json'
            }
        }).then((res) => {
            return res.json(); // Get JSON data from response
        }).then((data) => {
            glob = data; // Store data in global variable
            showResults(data); // Show results
        });
}

function processText(text){
    /**
     * This processes the text by turning spaces into dashes and splitting by commas.
     */
    if(text == ''){ // Empty then null for database
        return null;
    }
    let textArray = text.toLowerCase().split(",");
    for(let i = 0; i < textArray.length; i++){
        textArray[i] = textArray[i].trim().replace(/ /g, "-"); // Replace spaces with dashes
    }
    return textArray;
}

function numProcess(item){
    /**
     * This processes the number by turning it into an int and returning null if it's empty.
     */
    if(item === null){
        return null
    }
    return parseInt(item);
}

function processTypes(){
    /**
     * This processes the types by checking to see which ones are checked and returning them.
     */
    let result = [];
    let typesElement = document.getElementById("types");
    let children = typesElement.getElementsByTagName("input");
    let counter = 0;
    for(let i = 0; i < children.length; i++){
        if(children[i].checked){
            result.push(children[i].value);
            counter ++;
        }
        if(counter == 3){ // Only 2 types allowed
            window.alert("Pokemon can only have 2 types");
            return 'EXIT'
        }
    }
    if(result.length == 0){ // Null out for database
        return null;
    }
    return result;
}

function showResults(data){
    /**
     * This function will display all pokemon that match the search criteria.
     * This should also include type and generation
     */
    let result = '<div id="searchResults">';
    for(let i = 0; i < data.length; i ++){
        let pokemon = data[i];
        result += "<div class='pokemon'>";
        result += "<h1>";
        result += "<a href='" + link + "/pokemon.html' onclick='store(\"" + i + "\")'>" + firstUpperCase(pokemon.name) + "</a>";
        result += "</h1>";
        let img = './img/' + pokemon.sprite;
        result += "<img class='sprite' src='" + img + "' alt='" + pokemon.name + "'/>";
        result += '<div class="stats">';
        result += showGen(pokemon.generation);
        result += showTypes(pokemon.types);
        result += '</div>';
        result += '</div>';
    }
    result += '</div>';
    document.getElementById('search').innerHTML = result; // Clear search fields
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

function firstUpperCase(str) {
    /**
     * This function will capitalize the first letter of a string.
     */
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function store(num){
    /**
     * This function will store the selected pokemon data in local storage before moving to the result.
     * While this technique may be a little unconvential, it does allow us to reduce server calls.
     */
    localStorage.setItem('pokemon',JSON.stringify(glob[num]));
}

function redirectBox(){
    console.log("redirecting to box");
    window.location.replace(link + '/box.html');
}