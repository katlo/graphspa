const express = require('express');
const port = 3000; 

//initialize express.
const app = express();
// Set the front-end folder to serve public assets.
app.use(express.static(__dirname));

// Start the server.
app.listen(port);
console.log('Listening on port ' + port + '...');