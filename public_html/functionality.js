function bEXP() {
    // gets the value from the slider that is within range
    let b = document.getElementById('base_experience').value;
    // displays the value changing on the site 
    document.getElementById('shiftVal1').innerText = b;
}

function ht() {
    let h = document.getElementById('height').value;
    document.getElementById('shiftVal2').innerText = h;
}
function hp() {
    let hp = document.getElementById('hp').value;
    document.getElementById('shiftVal3').innerText = hp;
}
function attack() {
    let a = document.getElementById('attack').value;
    document.getElementById('shiftVal4').innerText = a;
}
function df() {
    let d = document.getElementById('defense').value;
    document.getElementById('shiftVal5').innerText = d;
}

function specialAttack() {
    let spA = document.getElementById('special_attack').value;
    document.getElementById('shiftVal6').innerText = spA;
}

function specialDefense(){
    let sDF = document.getElementById('special_defense').value;
    document.getElementById('shiftVal7').innerText = sDF;
}

function sp(){
    let s = document.getElementById('speed').value;
    document.getElementById('shiftVal8').innerText = s;
}

function wgt(){
    let w = document.getElementById('weight').value;
    document.getElementById('shiftVal9').innerText = w;
}

function percent(){
    let p = document.getElementById('catch_percent').value;
    document.getElementById('shiftVal10').innerText = p;
}