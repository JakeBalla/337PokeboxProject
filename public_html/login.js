function login(){
    let u = document.getElementById('uLogin').value;
    let p = document.getElementById('pLogin').value;

    let data = {username: u, password: p};

    let x = fetch('/accounts/login/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    });

    x.then((response) => {
        return response.text();
    }).then((text) => {
        if(text.startsWith('SUCCESS')){
            window.location.href = '/pokemon.html';
        }else{
            alert('Invalid Login');
        }
    });
}

function createAccount(){
    let u = document.getElementById('uCreate').value;
    let p = document.getElementById('pCreate').value;

    let x = fetch('/account/create/' + u + '/' + encodeURIComponent(p));

    x.then((response) => {
        return response.text();
    }).then((text) => {
        alert(text);
    });
}