import Pokedex from 'pokedex-promise-v2';
import mongoose from 'mongoose';
import fs from 'fs';
import readline from 'readline';
const p = new Pokedex();
// Connect to MongoDB
const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Insert Schema here
// Consider moves and locations

let pokemonSchema = new mongoose.Schema({
    abilities: Array,
    base_experience: Number,
    height: Number,
    id: Number,
    name: String,
    hp: Number,
    attack: Number,
    defense: Number,
    special_attack: Number,
    special_defense: Number,
    speed: Number,
    types: Array,
    weight: Number,
    picture: String,
    sprite: String,
    moves: Array
});
let pokemon = mongoose.model('pokemon', pokemonSchema );

async function processLineByLine() {
    const fileStream = fs.createReadStream('pokemon.csv');
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    let pokemonNames = [];
    for await (const line of rl) {
        let arr = line.split(",");
        if(arr[0] == "id"){
            continue;
        }
        if(arr[arr.length - 1] == "0"){
            break;
        }
        pokemonNames.push(arr[1]);
    }
    return pokemonNames;
}
processLineByLine().then((pokemonNames) => {
    console.log("doing the call");
    return p.getPokemonByName(pokemonNames);
}).then((response) => {
    console.log("Obtained response");
    for(let i = 0; i < response.length; i++){
        console.log(i);
        let data = response[i];
        let abilities = abilitiesProcess(data["abilities"]);
        let stats = statsProcess(data["stats"]);
        let types = typesProcess(data["types"]);
        let newPokemon = new pokemon({
            abilities: abilities,
            base_experience: data["base_experience"],
            height: data["height"],
            id: data["id"],
            name: nameProcess(data["name"]),
            hp: stats["hp"],
            attack: stats["attack"],
            defense: stats["defense"],
            special_attack: stats["special-attack"],
            special_defense: stats["special-defense"],
            speed: stats["speed"],
            types: types,
            weight: data["weight"],
            picture: imgProcess(data["sprites"]["other"]["official-artwork"]["front_default"]),
            sprite: imgProcess(data["sprites"]["front_default"]),
            moves: movesProcess(data["moves"])
        });
        newPokemon.save();
    }
}).then(() => {
    console.log("Done");
}).catch((error) => {
    console.log(error);
});

function abilitiesProcess(abilities) {
    let result = new Set();
    for(let item of abilities){
        if(!result.has(item["ability"]["name"])){
            result.add(item["ability"]["name"]);
        }
    }
    result = Array.from(result);
    result.sort();
    return result;
}

function statsProcess(stats){
    let result = {};
    for(let item of stats){
        result[item["stat"]["name"]] = item["base_stat"];
    }
    return result;
}

function typesProcess(types){
    let result = [];
    for(let item of types){
        result.push(item["type"]["name"]);
    }
    return result;
}

function imgProcess(link){
    if(link == null){
        return "EMPTY";
    }
    let arr = link.split("/");
    return arr.splice(6, arr.length).join("/");
}

function movesProcess(moves){
    let result = [];
    for(let item of moves){
        result.push(item["move"]["name"]);
    }
    result.sort();
    return result;
}

function nameProcess(name){
    return name.charAt(0).toUpperCase() + name.slice(1);
}