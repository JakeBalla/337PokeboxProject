/*
    Author: Jake Balla
    Purpose: This program extracts all gen 1-8 pokemon from the Poke API database. 
    This is the most complete open source Pokemon database so it makes sense to scrape from it.
    It is under fair use to scrape from this database as long as caching is used.
    The node module 'pokedex-promise-v2' makes these api calls easy and meets this requirement for us.
    I have gone through on processed some of the data in order to only get data which will be useful for our app.
    I also processed it in a way to make it easier to extract the necessary data from.
*/
import Pokedex from 'pokedex-promise-v2'; // This is needed for api calls, must use '.mjs' extension due to this.
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
// Consider locations (an extra api call per a pokmeon hence not doing for now)
// This defines a pokemon, feel free to look over
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
    /*
    This file goes through and processes each line of a csv file containing pokemon names.
    It has to be a defualt pokemon, vairants will add a lot of complecxity and are lacking in some data.
    */
    const fileStream = fs.createReadStream('pokemon.csv');
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    let pokemonNames = []; // This stores name
    for await (const line of rl) {
        let arr = line.split(",");
        if(arr[0] == "id"){ // Skip first header line
            continue;
        }
        if(arr[arr.length - 1] == "0"){ // Skip non default pokemon
            break;
        }
        pokemonNames.push(arr[1]);
    }
    return pokemonNames;
}
processLineByLine().then((pokemonNames) => {
    /*
    Once done do an api call for all Pokemon on server, this takes a while
    */
    console.log("doing the call");
    return p.getPokemonByName(pokemonNames);
}).then((response) => {
    console.log("Obtained response");
    for(let i = 0; i < response.length; i++){
        // Loops through all Pokemon and adds them to MongoDb
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
    /*
    This adds all abilities to a Pokemon, removing duplicates
    */
    let result = new Set();
    for(let item of abilities){
        if(!result.has(item["ability"]["name"])){ // No dupllicates
            result.add(item["ability"]["name"]);
        }
    }
    result = Array.from(result);
    result.sort(); // Sort to make it look pretty
    return result;
}

function statsProcess(stats){
    /*
    Loops through all stat keys and grabs their name and data
    */
    let result = {};
    for(let item of stats){
        result[item["stat"]["name"]] = item["base_stat"];
    }
    return result;
}

function typesProcess(types){
    /*
    Loops through all types and grabs their name
    */
    let result = [];
    for(let item of types){
        result.push(item["type"]["name"]);
    }
    return result;
}

function imgProcess(link){
    /*
    Get only the segment of the link that points to folder and file
    */
    if(link == null){ // Fixes an error with some Pokemon
        return "EMPTY";
    }
    let arr = link.split("/");
    return arr.splice(6, arr.length).join("/");
}

function movesProcess(moves){
    /*
    Processes all moves adding them to a Pokemon
    */
    let result = [];
    for(let item of moves){
        result.push(item["move"]["name"]);
    }
    result.sort(); // Sort to make it look pretty
    return result;
}

function nameProcess(name){
    /*
    Make first letter of name uppercase
    */
    return name.charAt(0).toUpperCase() + name.slice(1);
}