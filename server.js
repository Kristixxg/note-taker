const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const fs = require('fs');
const PORT = 3001;
const app = express();
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// provide access to public folder
app.use(express.static('public'));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})



//get request for all the notes
app.get('/api/notes', (req, res) => {
    //log that a get request is received to the terminal 
    console.info(`${req.method} request received to get notes`);
    //sending all notes to the client
    return res.json(noteData);
})

//post request to add a note
app.post('/api/notes', (req, res) => {
    //log that a post request is received to the terminal
    console.info(`${req.method} request received to add a review`);
    
    //prepare a note object to send back to the client 
    let note;
    if (req.body && req.body.product) {
        note = {
            status: 'success',
            data: req.body,
        }
        noteData.push(req.body);
        res.json(`Note for ${note.data.product} has been added!`)
    } else {
        res.json(`Note must at least contain a title`)
    }

    console.log(req.body);
})


//Fallback route for when a user attempts to visit routes that dont exist
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})


app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
})