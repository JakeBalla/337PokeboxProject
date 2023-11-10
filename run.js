const https = require('http');
        
function makeRequest() {
  https.get('http://164.92.125.40', (resp) => {
    let data = '';                                                                           
    resp.on('data', (chunk) => {
      data += chunk;
    }); 
    resp.on('end', () => {
      //console.log(data);
      console.log('request made')
    }); 
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  }); 
}       
        
setInterval(makeRequest, 100);