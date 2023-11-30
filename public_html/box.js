let boxNumber = 0;
if(localStorage.getItem('boxNumber')){
    boxNumber = localStorage.getItem('boxNumber');
}

window.addEventListener('load', () => {
    document.getElementById('boxNumber').innerHTML = 'Box ' + boxNumber;
});

document.getElementById('previous').addEventListener('click', () =>{ 
    console.log('hello');
    if(boxNumber > 0){
        boxNumber--;
        localStorage.setItem('boxNumber', boxNumber);
        document.getElementById('boxNumber').innerHTML = 'Box ' + boxNumber;
    }
});

document.getElementById('next').addEventListener('click', () =>{
    if(boxNumber < 9){
        boxNumber++;
        localStorage.setItem('boxNumber', boxNumber);
        document.getElementById('boxNumber').innerHTML = 'Box ' + boxNumber;
    }
});

document.getElementById('addButton').addEventListener('click', () =>{
    window.location.href = 'search.html';
});