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
const http = require('http');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

// Certificate
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/pokebox.live/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/pokebox.live/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/pokebox.live/chain.pem', 'utf8');

// const credentials = {
// 	key: privateKey,
// 	cert: certificate,
// 	ca: ca
// };

// Starting both http & https servers
const httpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);
httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

// httpsServer.listen(443, () => {
// 	console.log('HTTPS Server running on port 443');
// });

app.use(parser.json()); // Parse JSON for POST requests
app.use(cookieParser()); // Parse cookies for login


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

let userSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String,
    boxes: Array
});

let boxSchema = new mongoose.Schema({
    pokemons: Array
});

let user = mongoose.model('user', userSchema);
let box = mongoose.model('box', boxSchema);

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

app.get('/get/name/:name', (req, res) => {
    pokemon.find({ name: req.params.name }).exec()
    .then((result) => {
        console.log(result);
        res.json(result);
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post('/add/user', (req, res) => { 
    /*
        This function adds a user to the database when a POST request is sent to it.
     */
    user.find({username: req.body.username}).exec().then((users) => { // Check to see if user already in database
        if(users.length > 0){
            res.status(404).end("User already exists"); // User already exists
        }
        else{ // Create and save new user
            let salt = crypto.randomBytes(16).toString('hex');
            let boxes = [];
            for(let i = 0; i < 10; i ++){
                boxes.push(new box({pokemons: []}));
            }
            let newUser = new user({
                username: req.body.username, 
                salt: salt,
                hash: crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex'),
                boxes: boxes
            }); // Build user
            newUser.save(); // Save user
            res.end('User added'); // User added successfully
        }
    });
});

app.post('/login/user', (req, res) => {
    /*  
        This function logs in a user and creates a cookie for the user.
    */
    user.findOne({username: req.body.username}).exec() // Find user
    .then((foundUser) =>{
        if(foundUser == undefined){ // Not found then error
            res.status(404).end("User not found");          
            return;
        }
        if(foundUser.hash !== crypto.pbkdf2Sync(req.body.password, foundUser.salt, 1000, 64, 'sha512').toString('hex')){ // Incorrect password
            res.status(401).end("Incorrect password");
            return;
        }
        let date = new Date();
        let time = date.getTime();
        res.cookie('user', { // Create cookie for user and include login time
            username: foundUser.username,
            loginTime: time
        });
        res.redirect('/box.html'); // Redirect to home page
    }); 
});

app.post('/add/tobox/:username/:boxNumber', (req, res) => {
    /*
        This function adds a pokemon to a box.
    */
   console.log(req.params.username);
   console.log(req.params.boxNumber);
    user.findOne({username: req.params.username}).exec() // Find user
    .then((foundUser) => {
        let boxNumber = parseInt(req.params.boxNumber);
        foundUser.boxes[boxNumber].pokemons.push(req.body.name); // Add the pokemon to the box
        foundUser.markModified('boxes'); // Mark the 'boxes' field as modified
        return foundUser.save(); // Save user
    })
    .then(() => {
        res.end('Pokemon added to box');
    })
    .catch((err) => {
        console.log(err);
        res.status(500).end('Error adding pokemon to box');
    });
});

app.get('/get/box/:username/:boxNumber', (req, res) => {
    /*
        This function gets a box from the database.
    */
    user.findOne({username: req.params.username}).exec() // Find user
    .then((foundUser) => {
        let boxNumber = parseInt(req.params.boxNumber);
        return foundUser.boxes[boxNumber]; // Return the box
    }).then((foundBox) => {
        let pokemonNames = foundBox.pokemons; // Get the array of Pokémon names
        let promises = [];

        // Create a promise for each Pokémon name
        pokemonNames.forEach((pokemonName) => {
            promises.push(pokemon.find({ name: pokemonName }).exec());
        });

        return Promise.all(promises); // Execute all promises concurrently
    }).then((foundPokemon) => {
        res.json([].concat(...foundPokemon)); // Return all the found Pokémon and put array into 1d form
    })
    .catch((err) => {
        console.log(err);
        res.status(500).end('Error getting box');
    });
});

app.post('/update/box/:username/:boxNumber', (req, res) => {
    /*
        This function updates a box in the database.
    */
    user.findOne({username: req.params.username}).exec() // Find user
    .then((foundUser) => {
        let boxNumber = parseInt(req.params.boxNumber);
        foundUser.boxes[boxNumber].pokemons = req.body; // Update box
        foundUser.markModified('boxes'); // Mark 'boxes' field as modified
        return foundUser.save(); // Save user
    })
    .then(() => {
        res.end('Box updated');
    })
    .catch((err) => {
        console.log(err);
        res.status(500).end('Error updating box');
    });
});

app.get('/import/box/:fromUser/:fromBox/:toUser/:toBox', (req, res) => {
    /*
        This function imports a box from another user.
    */
    let fromUser = req.params.fromUser;
    let fromBox = parseInt(req.params.fromBox);
    let toUser = req.params.toUser;
    let toBox = parseInt(req.params.toBox);
    let boxtoImport;

    user.findOne({ username: fromUser }).exec() // Find the user to import from
        .then((foundUser) => {
            boxToImport = foundUser.boxes[fromBox].pokemons; // Get the box to import
            return user.findOne({ username: toUser }).exec(); // Find the user to import to
        })
        .then((foundUser) => {
            console.log(boxToImport);
            foundUser.boxes[toBox].pokemons = foundUser.boxes[toBox].pokemons.concat(boxToImport); // Merge the boxToImport array onto the end
            foundUser.markModified('boxes'); // Mark 'boxes' field as modified
            return foundUser.save(); // Save the user
        })
        .then(() => {
            res.end('Box imported');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).end('Error importing box');
        });
});

function validCookie(userCookie){
    /*
        This function checks to see if a cookie is valid.
     */
    if(userCookie){
        const currentTime = new Date().getTime();
        const loginTime = userCookie.loginTime;
        if (currentTime - loginTime <= 3600000) { // 1 hour in milliseconds
            return true;
        }
    }
    return false;
}

app.get('/', (req, res) =>{
    /*
        This makes sure a user is logged in before serving the home page.
    */
    const userCookie = req.cookies.user;
    if(validCookie(userCookie)){ // Logged in
        res.sendFile(__dirname + '/public_html/box.html'); // Serve box.html
    }
    else{ // Not logged in
        res.sendFile(__dirname + '/public_html/index.html'); // Serve index.html
    }
});

app.use((req, res, next) => {
    const userCookie = req.cookies.user;
    let content = req.path.split('.');
    console.log(content);
    if(content.length > 1 && content[1] != 'html'){ // Allow passage if not html
        express.static('public_html')(req, res, next);
        return;
    }
    if (!req.path.endsWith('.html') && !req.path.endsWith('/')) {
        req.url += '.html'; // Append '.html' to the URL
    }
    if (validCookie(userCookie) || req.path === '/index.html') {
        if (req.path.endsWith('.html')) {
            express.static('public_html')(req, res, next);
        } else {
            next();
        }
    } else {
        res.sendFile(__dirname + '/public_html/index.html'); // Serve index.html
    }
});