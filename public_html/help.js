/**
 * Authors: Jake Balla, Cesar Perez, Audrina Campa, Chris Machado
 * Purpose: This file is the script for the help page.
 * It contains the HTML for the help page and the logic for the next and previous buttons.
 */
helpPageHTML = []; // Store help pages in an array
var count = 0;
helpPageHTML.push('<img id="help-image"src="img/login-screen.png" alt="picure of the login screen">\n<h1>Using the login page</h1>\n<ol>\n<li>Creating an Account</li>\n<ul>\n<li>You must create an account before logging in on the website</li>\n<li>Use bottom entry fields to fill out information for your new account and click the "Create Account" button when you are done</li>\n<li>Your password must be at least 8 characters long</li>\n</ul>\n<li>Logging in</li>\n<ul>\n<li>Enter your username and password in top entry fields to log in</li>\n<li>You will be redirected to your box page upon a successful login</li>\n</ul>\n</ol>');
helpPageHTML.push('<img id="help-image"src="img/box-page.png" alt="picure of the login screen">\n<h1>Using the box page</h1>\n<ol>\n<li>Using the box</li>\n<ul>\n<li>The green box in the middle of the page is your Pokebox. This displays each pokemon in your box</li>\n<li>Hover over a pokemon to display its stats</li>\n<li>Right click on a pokemon to remove it from your box</li>\n</ul>\n<li>Stat display box</li>\n<ul>\n<li>Gray box on the left. Displays a pokemon\'s stats</li>\n<li>Left and right arrows in the box change the user\'s current pokebox</li>\n</ul>\n<li>Add pokemon button</li>\n<ul>\n<li>Click on this pokemon to be taken to the add pokemon page</li>\n</ul>\n</ol>');
helpPageHTML.push('<img id="help-image"src="img/seach-and-select-pages.jpg" alt="picure of the login screen">\n<h1>Search and Selecting a Pokemon</h1>\n<ol>\n<li>Searching for a Pokemon</li>\n<ul>\n<li>Pictured left</li>\n<li>Search criteria is specified by entry fields</li>\n<li>Click search button to display search results</li>\n</ul>\n<li>Selecting a Pokemon</li>\n<ul>\n<li>Click on a Pokemon\'s name to add it to your box</li>\n</ul>\n</ol>');
helpPageHTML.push('<img id="help-image"src="img/view-box.png" alt="picure of the login screen">\n<h1>Viewing Another Users Box</h1>\n<ol>\n<li>View Friends Box Searchbar</li>\n<ul>\n<li>Enter another (valid) users name and press enter to view their box</li>\n</ul>\n<li>Importing another users box</li>\n<ul>\n<li>While viewing another users box, click on the import box button to import their pokemon to your box</li>\n<li>Click on the back button to return to viewing your own box</li>\n</ul>\n</ol>');

window.onload = () =>{
    count = 0; // On load we are on the first page
}

document.getElementById('next-button').addEventListener('click', ()=>{
    /**
     * This function will load the next page of the help page
     */
    count++;
    count = count % helpPageHTML.length;
    document.getElementById('helpText').innerHTML= helpPageHTML[count];
});

document.getElementById('prev-button').addEventListener('click', ()=>{
    /**
     * This function will load the previous page of the help page
     */
    count--;
    count = count >= 0 ? count : helpPageHTML.length - 1;
    document.getElementById('helpText').innerHTML= helpPageHTML[count];
});