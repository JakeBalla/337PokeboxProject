/**
 * Author: Jake Balla
 * Purpose: This file provide client code for sending search requests to the database.
 */
function getPokemons() {
    /**
     * This file grabs the appropriate data from the page and processes it to return from the database.
     */
    let container = {}; // Storage
    container['name'] = document.getElementById("name").value;
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

    let url = 'http://127.0.0.1/get/pokemon';
    let p = fetch(url, { // Send to server
        method: 'POST',
        body: JSON.stringify(container),
        headers: {
            'Content-Type': 'application/json'
            }
        }).then((res) => {
            return res.json(); // Get JSON data from response
        }).then((data) => {
            console.log(data); // Use the JSON data
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