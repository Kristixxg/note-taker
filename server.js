const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();
const uuid = require('./helpers/uuid');
const noteList = require('./db/db.json');

const fs = require('fs');

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
    res.json(noteList);
})

//post request to add a note
app.post('/api/notes', (req, res) => {
    //log that a post request is received to the terminal
    console.info(`${req.method} request received to add a review`);

    //prepare a note object to send back to the client
    const {title, text } =  req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        noteList.push(newNote);
        
        const response = {
            status: 'success',
            body: newNote,
        };
        
        res.json(response);
    } else {
        res.json('Error in posting note');
    }
});


//Fallback route for when a user attempts to visit routes that dont exist
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})


app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
})