// Requiring module
const express = require('express');
const cors = require('cors'); // Add this line
const path = require('path');

// Creating express object
const app = express();

// Enable CORS
app.use(cors()); // Add this line

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html
app.get('/itinerary', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handling GET request
app.get('/', (req, res) => { 
    res.send('A simple Node App is '
        + 'running on this server') 
    res.end() 
}) 

// Port Number
const PORT = process.env.PORT ||5000;

// Server Setup
app.listen(PORT,console.log(
  `Server started on port ${PORT}`));
