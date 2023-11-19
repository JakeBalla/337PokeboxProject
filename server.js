/**
 * Author: Jake Balla
 * Purpose: This is the server for the website. 
 * Right now it only serves static files and a search engine (not pretty).
 */
const hostname = '127.0.0.1';
const port = 80;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();
// Connect to MongoDB
const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
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
app.listen(port, () => { // Start server
    console.log(`Server running at http://${hostname}:${port}/`); 
});
app.use(parser.json()); // Parse JSON for POST requests
app.use(cookieParser()); // Parse cookies for login

app.post('/get/pokemon', (req, res) => {
    const { // Extract it all for easier processing
        abilities,
        base_experience,
        height,
        name,
        hp,
        attack,
        defense,
        special_attack,
        special_defense,
        speed,
        types,
        weight,
        moves,
        generation,
        growth_rate,
        catch_percent,
        legendary,
        mythical,
    } = req.body;
    let filter = {};
    if (abilities) 
        filter.abilities = { $in: Array.isArray(abilities) ? abilities : [abilities] };
    if (base_experience) 
        filter.base_experience = { $gte: base_experience};
    if (height) 
        filter.height = { $gte: height };
    if (name) 
        filter.name = { $regex: new RegExp(`^${name}`) };
    if (hp) 
        filter.hp = { $gte: hp };
    if (attack) 
        filter.attack = { $gte: attack };
    if (defense) 
        filter.defense = { $gte: defense };
    if (special_attack) 
        filter.special_attack = { $gte: special_attack };
    if (special_defense) 
        filter.special_defense = { $gte: special_defense };
    if (speed) 
        filter.speed = { $gte: speed };
    if (types) 
        filter.types = { $all: Array.isArray(types) ? types : [types] };
    if (weight) 
        filter.weight = { $gte: weight };
    if (moves) 
        filter.moves = { $all: Array.isArray(moves) ? moves : [moves] };
    if (generation) 
        filter.generation = generation;
    if (growth_rate) 
        filter.growth_rate = growth_rate;
    if (catch_percent) 
        filter.catch_percent = { $gte: catch_percent };
    if (legendary) 
        filter.legendary = legendary;
    if (mythical) 
        filter.mythical = mythical;
    pokemon.find(filter).exec()
    .then((result) => {
        console.log(result);
        res.json(result);
    })
    .catch((err) => {
        console.log(err);
    });
});

app.use(express.static('public_html')); // Serve static files