let link = 'https://pokebox.live'; // Link to server

document.getElementById('login').addEventListener('click', () =>{
    /*
        This function adds an event listener to the login button.
        When clicked it will send the user to be authenticated by the server.
     */
    let container = {}; // Container to send as JSON
    container['username'] = document.getElementById('uLogin').value;
    container['password'] = document.getElementById('pLogin').value;
    if(container['username'] == "" || container['password'] == ""){ // Make sure all fields are filled out
        alert("Please fill out all fields before submitting!");
        return;
    }
    let p = fetch(link + "/login/user",{ // Send info to server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(container)
    }).then((res) => {
        if(res.status == 404 || res.status == 401){ // If user not found
            return res.text().then((data) => { // Grab text error and if appropriate alert user
                if(data == "User not found" || data == 'Incorrect password'){
                    alert(data); // Set error message
                    return;
                }
            });
        }
        else{
            localStorage.setItem('username', container['username']); // Store username for easy access by home page
            window.location.replace( link + '/box.html'); // Redirect
        }
    });
});

document.getElementById('create').addEventListener('click', () => {
    /*
        This function adds an event listener to the add user button.
        When clicked it will send a user to be added to the server.
     */
    let container = {}; // Container to send as JSON
    container['username'] = document.getElementById('uCreate').value;
    container['password'] = document.getElementById('pCreate').value;
    if(container['username'] == "" || container['password'] == ""){ // Make suyre all fields are filled out
        alert("Please fill out all fields before submitting!");
        return;
    }
    if(container['password'].length < 8){ // Password too short
        alert('Password must be at least 8 characters long!');
        return;
    }
    let p = fetch(link + "/add/user", { // Send to server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(container)
    }).then((res) => {
        if(res.status == 404){ // Something went wrong
            return res.text().then((data) => { // Grab text error and if appropriate alert user
                if(data == "User already exists"){ // User already exists
                    alert(data);
                }
            });
        }
        else if (res.status == 200){
            alert('User added successfully!'); // Let user know they were sucessfully added
        }
    }).catch((error) => { // Catch errors and notify
        console.log(error);
    });

    document.getElementById('uCreate').value = "";
    document.getElementById('pCreate').value = "";
});