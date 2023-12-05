/**
 * Authors: Jake Balla, Cesar Perez, Audrina Campa, Chris Machado
 * Purpose: This file acts as the script for the Pokemon page.
 * It is responsible for processing the pokemon and displaying it to the user.
 * This includes stats, abilities, moves, and evolutions.
 * It also has buttons to add the pokemon to the user's box or to go back to the box.
 */

let glob = {};
let link = 'https://pokebox.live';

window.addEventListener('load', () => {
    /**
     * This function loads the appopriate Pokemon to display
     */
    let pokemon = localStorage.getItem('pokemon');
    if (pokemon) { // Load if not null
        pokemon = JSON.parse(pokemon);
        processPokemon(pokemon);
    }
    else{
        console.log('Failed to load pokemon!');
    }
});

function processPokemon(pokemon){
    /**
     * This function calls the appopriate functions to process the pokemon and then displays it
     */
    processStats(pokemon);
    processIcons(pokemon);
    processEvolutions(pokemon.evolutions);
    processAbilities(pokemon.abilities);
    processMoves(pokemon.moves);
    makeTable(pokemon);
    document.getElementById('info').style.display = ''; // Allows user to see pokemon after all this processing is done
}

function upperCaseFirstLetter(string) {
    /**
     * This function capitalizes the first letter of a string
     */
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function processCatchPercent(string){
    /**
     * This function makes catch perecnt two numbers after the decimal point and adds a percent sign
     */
    let number = parseInt(string);
    number.toFixed(2); // Two decimal numbers
    let result = number + "%";  // Percent sign
    return result;
}

function processStats(pokemon){
    /**
     * This function processes the stats of the pokemon and displays them
     */

    // Get all the elements to display the stats
    let name = document.getElementById('name');
    let image = document.getElementById('pokemonImg');
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

    // Set result
    name.innerText = upperCaseFirstLetter(pokemon.name);
    image.src = './img/' + pokemon.picture; // Set sprite
    image.alt = upperCaseFirstLetter(pokemon.name);
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
}

function processIcons(pokemon){
    /**
     * This function processes the icons to display below the sprite
     */
    let icons = document.getElementById('icons');
    let result = '';
    result += '<img src="./img/gens/' + pokemon.generation + '.png" alt=" ' + pokemon.generation + ' " id="generation">'; // generation
    for (let i = 0; i < pokemon.types.length; i++) { // types
        result += '<img src="./img/types/' + pokemon.types[i] + '.png" alt=" ' + pokemon.types[i] + ' " class="types">';
    }
    if (pokemon.legendary) { // legenday
        result += '<img src="./img/types/legendary.png" alt="Legendary" id="legendary">';
    }
    if(pokemon.mythical){ // mythical
        result += '<img src="./img/types/mythical.png" alt="Mythical" id="mythical">';
    }
    icons.innerHTML = result;
}

async function processEvolutions(evolutions){
    /**
     * This function processes the evolutions of the Pokemon and preps evolutions for being clicked on
     */
    let evolution = document.getElementById('evolutions');
    let result = '';
    for (let i = 0; i < evolutions.length; i++) {
        result += '<li><a href="./pokemon.html" onclick="nextPokemon(' + i + ')">' + upperCaseFirstLetter(evolutions[i]) + '</a></li>'; // Place index for quick location
        await fetch( link + '/get/name/' + evolutions[i]) // Get data for evolutions
        .then(response => response.json())
        .then(data => {
            glob[i] = data; // Store for later
        });
    }
    evolution.innerHTML = result;
}

function nextPokemon(index){
    /**
     * Store the next pokemon to be displayed
     */
    localStorage.setItem('pokemon', JSON.stringify(glob[index][0]));
}

function processAbilities(abilities){
    /**
     * This function processes the abilities of the Pokemon and displays them in a list
     */
    let abilitiesList = document.getElementById('abilities');
    result = '';
    for (let i = 0; i < abilities.length; i++) {
        result += '<li>' + upperCaseFirstLetter(abilities[i]) + '</li>';
    }
    abilitiesList.innerHTML = result;
}

function processMoves(moves){
    /**
     * This function processes the moves of the Pokemon and displays them in a table
     */
    let movesList = document.getElementById('moves');
    let result = '<h2 id = "movesHeader" >Moves</h2><table>';
    let count = 0;
    for (let i = 0; i < moves.length; i++) {
        if(count == 0){ // Get new row
            result += '<tr>';
        }
        result += '<td>' + upperCaseFirstLetter(moves[i]) + '</td>';
        count++;
        if(count == 3){  // 3 moves per row
            result += '</tr>';
            count = 0;
        }
    }
    if(count > 0){
        result += '</tr>'; // Add tr if not already added
    }
    result += '</table>';
    movesList.innerHTML = result;
}

function makeTable(pokemon){
    /**
     * This function makes the table of locations for the Pokemon
     */
    if(pokemon.locations == undefined){ // Undefined then nothing to display here
        return;
    }
    let table = document.getElementById('locations');
    let result = '<tr><th>Game</th><th>Sprite</th><th>Locations</th></tr>'; // Header
    let generations = Object.keys(pokemon.games); // Get generations
    for(let gen of generations){
        let games = Object.keys(pokemon.games[gen]); // Get games of generation
        for(let game of games){ // Go through games
            let versions = game.split('-'); // Split out games that have two versions (ex. red-blue)
            let name = upperCaseFirstLetter(versions[0]);
            if(versions.length > 1){ // Display both versions
                name = upperCaseFirstLetter(versions[0]) + ' , ' + upperCaseFirstLetter(versions[1]);
            }
            let sprite = pokemon.games[gen][game].sprite;
            let row = '<tr><td>' + name + '</td><td><img src="./img/' + sprite + '" alt="' + name + '"></td><td><ul>'; // Display name and sprite
            if(!(versions[0] in pokemon.locations)){ // No location for this version, ignore
                continue;
            }
            let locations = Object.keys(pokemon.locations[versions[0]]); // Get locations for first version of game set
            for (let location of locations) {
                let stats = pokemon.locations[versions[0]][location]; // get location stats
                let string = upperCaseFirstLetter(location) + '(' + stats['min_level'] + '-' + stats['max_level'] + ' lvl , ' + stats['chance'] + '%)'; // Place in string
                row += '<li>' + string + '</li>'; // Add to row
            }
            result += row + '</ul></td></tr>';
        }
    }
    table.innerHTML = result;
}

document.getElementById('addButton').addEventListener('click', () =>{
    /**
     * This function adds the Pokemon to the user's box
     */
    let url = link + '/add/tobox/' + localStorage.getItem('username') + '/' + localStorage.getItem('myBoxNumber'); // Build out link
    let pokemon = JSON.parse(localStorage.getItem('pokemon')); // Get pokemon data
    let name = {};
    name['name'] = pokemon.name;
    let p = fetch(url, { // Send to server
        method: 'POST',
        body: JSON.stringify(name),
        headers: {
            'Content-Type': 'application/json'
            }
        }).then( () => {
            window.location.href = 'box.html';
        });
})

document.getElementById('toBox').addEventListener('click', () =>{
    /**
     * This function sends the user back to the box
     */
    window.location.replace(link + '/box.html');
});