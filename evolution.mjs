import Pokedex from 'pokedex-promise-v2'; // This is needed for api calls, must use '.mjs' extension due to this.
import mongoose from 'mongoose';
let p = new Pokedex();
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
    moves: Array, // Everything below this needs to be added using species
    evolution: Array,
    generation: String,
    growth_rate: String,
    catch_percent: Number,
    habitat: String,
    legendary: Boolean,
    mythical: Boolean
});