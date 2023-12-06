/*
  Author: Jake Balla, Ceasar Perez, Audrina Campa, Chris Machado
  Purpose: This program extracts all gen 1-9 pokemon from the Poke API database. 
  This is the most complete open source Pokemon database so it makes sense to scrape from it.
  It is under fair use to scrape from this database as long as caching is used.
  The node module 'pokedex-promise-v2' makes these api calls easy and meets this requirement for us.
  I have gone through on processed some of the data in order to only get data which will be useful for our app.
  I also processed it in a way to make it easier to extract the necessary data from.
*/
import Pokedex from 'pokedex-promise-v2'; // This is needed for api calls, must use '.mjs' extension due to this.
import mongoose, { Schema } from 'mongoose';
import fs from 'fs';
import readline from 'readline';
const p = new Pokedex();

// Connect to MongoDB
const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Pokemon Schema
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
    games: Object,
    sprite: String,
    moves: Array, 
    evolutions: Array,
    evolved_from: String,
    generation: String,
    growth_rate: String,
    catch_percent: Number,
    habitat: String,
    legendary: Boolean,
    mythical: Boolean,
    locations: Object
});
let pokemon = mongoose.model('pokemon', pokemonSchema);

async function fetchAndSavePokemonData() {
    /*
    This function scrapes from the API and places the data into our database
    */
  const pokemonNames = await processLineByLine(); // This gets a list of Pokemon names to processq

  for (const pokemonName of pokemonNames) { // Loop through all Pokemon
    try {
      const data = await p.getPokemonByName(pokemonName); // This is a call for pokemon data
      const abilities = abilitiesProcess(data["abilities"]);
      const stats = statsProcess(data["stats"]);
      const types = typesProcess(data["types"]);
      console.log(data);

      const pokemonInfo = { // Shove it into object to store for next data calls
        abilities: abilities,
        base_experience: data["base_experience"],
        height: data["height"],
        id: data["id"],
        name: data["name"],
        hp: stats["hp"],
        attack: stats["attack"],
        defense: stats["defense"],
        special_attack: stats["special-attack"],
        special_defense: stats["special-defense"],
        speed: stats["speed"],
        types: types,
        weight: data["weight"],
        picture: imgProcess(data["sprites"]["other"]["official-artwork"]["front_default"]),
        games: gameProcess(data['sprites']['versions']),
        sprite: imgProcess(data["sprites"]["front_default"]),
        moves: movesProcess(data["moves"]),
      };

      const speciesData = await p.getPokemonSpeciesByName(pokemonInfo['name']); // This call is for species (which contains some other info for a pokemon)
      pokemonInfo['catch_percent'] = catchProcess(speciesData['capture_rate']);
      pokemonInfo['legendary'] = speciesData['is_legendary'];
      pokemonInfo['mythical'] = speciesData['is_mythical'];
      pokemonInfo['growth_rate'] = speciesData['growth_rate']['name'];
      pokemonInfo['generation'] = speciesData['generation']['name'];

      if(pokemonInfo['habitat'] != null){ // New pokemon do not have habitat data, sadly
        pokemonInfo['habitat'] = speciesData['habitat']['name'];
      }

      if (speciesData['evolves_from_species']) { // Some pokemon are base forms
        pokemonInfo['evolved_from'] = speciesData['evolves_from_species']['name'];
      }

      const evoId = evoIDProcess(speciesData['evolution_chain']['url']);
      const evolutionResponse = await p.getEvolutionChainById(evoId); // Get evolution data for a Pokemon
      pokemonInfo['evolutions'] = evolutionProcess(evolutionResponse['chain']);

      const encountersUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonInfo['id']}/encounters`; // Have to use url here, no native suport
      const encountersResponse = await p.getResource(encountersUrl); // Finds locations where a Pokemon can be found
      if(encountersResponse == [] || pokemonInfo['id'] == 385){ // Pokemon number 385 is missing this data
        pokemonInfo['locations'] = null;
      }
      else{
        pokemonInfo['locations'] = locationProcess(Object.values(encountersResponse));
      }
      console.log(pokemonInfo);

      const newPokemon = new pokemon({ // Build out pokemon with our data
        abilities: pokemonInfo['abilities'],
        base_experience: pokemonInfo['base_experience'],
        height: pokemonInfo['height'],
        id: pokemonInfo['id'],
        name: pokemonInfo['name'],
        hp: pokemonInfo['hp'],
        attack: pokemonInfo['attack'],
        defense: pokemonInfo['defense'],
        special_attack: pokemonInfo['special_attack'],
        special_defense: pokemonInfo['special_defense'],
        speed: pokemonInfo['speed'],
        types: pokemonInfo['types'],
        weight: pokemonInfo['weight'],
        picture: pokemonInfo['picture'],
        sprite: pokemonInfo['sprite'],
        games: pokemonInfo['games'],
        moves: pokemonInfo['moves'],
        evolutions: pokemonInfo['evolutions'],
        evolved_from: pokemonInfo['evolved_from'],
        generation: pokemonInfo['generation'],
        growth_rate: pokemonInfo['growth_rate'],
        catch_percent: pokemonInfo['catch_percent'],
        habitat: pokemonInfo['habitat'],
        legendary: pokemonInfo['legendary'],
        mythical: pokemonInfo['mythical'],
        locations: pokemonInfo['locations']
      });
      await newPokemon.save(); // Save to database

    } catch (error) {
      console.error(`Error processing ${pokemonName}:`, error);
    }
  }

  console.log('Finished Process!');
  mongoose.connection.close();
}

async function processLineByLine() {
    /*
    This reads a file of pokemon names to be processed
    */
  const fileStream = fs.createReadStream('pokemon.csv'); // Get pokemon.csv
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  const pokemonNames = [];

  for await (const line of rl) {
    const arr = line.split(",");
    if (arr[0] !== "id" && arr[arr.length - 1] !== "0") { // Ignore header
      pokemonNames.push(arr[1]); // Push name to list
    }
  }
  return pokemonNames;
}

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
    return arr.splice(6, arr.length).join("/"); // Everythhing that points to a file
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

function catchProcess(catch_rate){
    /*
    Makes it a percent which is more useful in my opinon
    */
    return (catch_rate / 255) * 100;
}

function evoIDProcess(url){
    /*
    This gets the evolution id we need
    */
    let arr = url.split("/"); // Kept in url
    return arr[arr.length - 2];
}

function evolutionProcess(pokemon_data){
    /*
    This gets the evolution family a pokemon is from
    */
    let family = [];

    function helper(pokemon){ // Helper function to recurse
        family.push(pokemon['species']['name']);
        if(pokemon["evolves_to"] == null || pokemon["evolves_to"].length == 0 ){ // No more to explore
            return;
        }
        let children = pokemon['evolves_to'];
        for (let child of children){ // Visit children
            helper(child);
        }
    }

    helper(pokemon_data);
    console.log(family);
    return family;
}

function gameProcess(game_data){
    /*
    This gets a sprites of pokemon from all games
    */
    let result = {};
    let gens = Object.keys(game_data);
    for(let gen of gens){
        result[gen] = {};
        let games = Object.keys(game_data[gen]);
        for(let game of games){
            result[gen][game] = {};
            result[gen][game]['sprite'] = versionProcess(game_data[gen][game]['front_default']); // Place sprite destination for that game
        }
    }
    return result;
}

function versionProcess(url){
    /*
    This makes a link a directory instead
    */
    if(url == null){
        return null;
    }
    let arr = url.split("/");
    return arr.splice(6, arr.length).join("/");
}

function locationProcess(values) {
    /*
    This processes the location data so it goes game then values
    */
    const processedData = {};
  
    values.forEach(entry => {
      entry.version_details.forEach(versionDetail => {
        const versionName = versionDetail.version.name;
        const locationName = entry.location_area.name;
  
        if (!processedData[versionName]) {
          processedData[versionName] = {};
        }
  
        processedData[versionName][locationName] = {
          min_level: versionDetail.encounter_details[0].min_level,
          max_level: versionDetail.encounter_details[0].max_level,
          chance: versionDetail.encounter_details[0].chance
        };
      });
    });
    return processedData;
  }

  fetchAndSavePokemonData(); // Run the program