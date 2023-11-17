function getPokemons() {
    let container = {};
    container['name'] = document.getElementById("name").value;
    if(container['name'] != null){
        container['name'] = container['name'].toLowerCase();
    }
    container['abilities'] = processAbilities();
    container['base_experience'] = document.getElementById("base_experience").value;
    container['base_experience'] = numProcess(container['base_experience']);
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
    console.log(container['height']);
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
function processAbilities(){
    let abilities = document.getElementById("abilities").value;
    if(abilities == ''){
        return null;
    }
    let abilityArray = abilities.toLowerCase().split(",");
    for(let i = 0; i < abilityArray.length; i++){
        abilityArray[i] = abilityArray[i].trim();
    }
    return abilityArray;
}
function numProcess(item){
    if(item === null){
        return null
    }
    return parseInt(item);
}