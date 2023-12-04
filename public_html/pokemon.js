let glob = {};
//let link = 'https://pokebox.live'; // Change this to 127 for local testing
let link = 'http://127.0.0.1';

window.addEventListener('load', () => {
    let pokemon = localStorage.getItem('pokemon');
    if (pokemon) {
        pokemon = JSON.parse(pokemon);
        processPokemon(pokemon);
    }
    else{
        console.log('Failed to load pokemon!');
    }
});

function processPokemon(pokemon){
    processStats(pokemon);
    processIcons(pokemon);
    processEvolutions(pokemon.evolutions);
    processAbilities(pokemon.abilities);
    processMoves(pokemon.moves);
    makeTable(pokemon);
    document.getElementById('info').style.display = ''; // Allows user to see pokemon after all this processing is done
}

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function processCatchPercent(string){
    let number = parseInt(string);
    number.toFixed(2);
    let result = number + "%";
    return result;
}

function processStats(pokemon){
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

    name.innerText = upperCaseFirstLetter(pokemon.name);
    image.src = './img/' + pokemon.picture;
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
    let icons = document.getElementById('icons');
    let result = '';
    result += '<img src="./img/gens/' + pokemon.generation + '.png" alt=" ' + pokemon.generation + ' " id="generation">';
    for (let i = 0; i < pokemon.types.length; i++) {
        result += '<img src="./img/types/' + pokemon.types[i] + '.png" alt=" ' + pokemon.types[i] + ' " class="types">';
    }
    if (pokemon.legendary) {
        result += '<img src="./img/types/legendary.png" alt="Legendary" id="legendary">';
    }
    if(pokemon.mythical){
        result += '<img src="./img/types/mythical.png" alt="Mythical" id="mythical">';
    }
    icons.innerHTML = result;
}

async function processEvolutions(evolutions){
    let evolution = document.getElementById('evolutions');
    let result = '';
    for (let i = 0; i < evolutions.length; i++) {
        result += '<li><a href="./pokemon.html" onclick="nextPokemon(' + i + ')">' + upperCaseFirstLetter(evolutions[i]) + '</a></li>';
        await fetch( link + '/get/name/' + evolutions[i])
        .then(response => response.json())
        .then(data => {
            glob[i] = data;
        });
    }
    console.log(glob);
    evolution.innerHTML = result;
}

function nextPokemon(index){
    console.log(glob[index]);
    localStorage.setItem('pokemon', JSON.stringify(glob[index][0]));
}

function processAbilities(abilities){
    let abilitiesList = document.getElementById('abilities');
    result = '';
    for (let i = 0; i < abilities.length; i++) {
        result += '<li>' + upperCaseFirstLetter(abilities[i]) + '</li>';
    }
    abilitiesList.innerHTML = result;
}

function processMoves(moves){
    let movesList = document.getElementById('moves');
    let result = '<h2 id = "movesHeader" >Moves</h2><table>';
    let count = 0;
    for (let i = 0; i < moves.length; i++) {
        if(count == 0){
            result += '<tr>';
        }
        result += '<td>' + upperCaseFirstLetter(moves[i]) + '</td>';
        count++;
        if(count == 3){
            result += '</tr>';
            count = 0;
        }
    }
    if(count > 0){
        result += '</tr>';
    }
    result += '</table>';
    movesList.innerHTML = result;
}

function makeTable(pokemon){
    if(pokemon.locations == undefined){
        return;
    }
    let table = document.getElementById('locations');
    let result = '<tr><th>Game</th><th>Sprite</th><th>Locations</th></tr>';
    let generations = Object.keys(pokemon.games);
    for(let gen of generations){
        let games = Object.keys(pokemon.games[gen]);
        for(let game of games){
            let versions = game.split('-');
            let name = upperCaseFirstLetter(versions[0]);
            if(versions.length > 1){
                name = upperCaseFirstLetter(versions[0]) + ' , ' + upperCaseFirstLetter(versions[1]);
            }
            let sprite = pokemon.games[gen][game].sprite;
            let row = '<tr><td>' + name + '</td><td><img src="./img/' + sprite + '" alt="' + name + '"></td><td><ul>';
            console.log(versions[0]);
            if(!(versions[0] in pokemon.locations)){
                continue;
            }
            let locations = Object.keys(pokemon.locations[versions[0]]);
            for (let location of locations) {
                let stats = pokemon.locations[versions[0]][location];
                let string = upperCaseFirstLetter(location) + '(' + stats['min_level'] + '-' + stats['max_level'] + ' lvl , ' + stats['chance'] + '%)';
                row += '<li>' + string+ '</li>';
            }

            result += row + '</ul></td></tr>';
        }
    }
    table.innerHTML = result;
}

document.getElementById('addButton').addEventListener('click', () =>{
    
    //NEED TO DISABLE ADD BUTTON WHEN USER DOESN'T HAVE ACOUNT OR LOGGED SESSION
    let url = link + '/add/tobox/' + localStorage.getItem('username') + '/' + localStorage.getItem('myBoxNumber');
    let pokemon = JSON.parse(localStorage.getItem('pokemon'));
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