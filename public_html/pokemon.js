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
        result += '<img src="./img/legendary.png" alt="Legendary" id="legendary">';
    }
    if(pokemon.mythical){
        result += '<img src="./img/mythical.png" alt="Mythical" id="mythical">';
    }
    icons.innerHTML = result;
}