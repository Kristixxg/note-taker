const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const uuid = require('./helpers/uuid');
let noteList = require('./db/db.json');
const { uptime } = require('process');


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
    //destructuring for items in req.body
    const { title, text } =  req.body;
    //if both properties are present
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };


        //obtain existing notes
        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);
                noteList = parsedNotes;

                fs.writeFile('./db/db.json', JSON.stringify(noteList), (err, data) => {
                    if (err) {
                        console.err(err)
                    } else {
                        console.log('successfully updated notes')
                    };
                });
            };
        });

        
        
        const response = {
            status: 'success',
            body: newNote,
        };
        
        res.json(response);
    } else {
        res.json('Error in posting note');
    }
});


//handle delete
app.delete("/api/notes/:id", (req, res) => {

    console.log(`${req.method} received`);

    const noteId = req.params.id;
    const updatedArr = [];

    for (let i=0; i<noteList.length; i++) {
        if (noteList[i].id !== noteId) {
            updatedArr.push(noteList[i]);
        }


    }

    if (updatedArr.length === noteList.length) {
        res.status(404);
        return;
    }

    noteList = updatedArr;

    fs.writeFile('./db/db.json', JSON.stringify(noteList), (err, data) => {
        if (err) {
            console.err(403)
        } else {
            console.log('successfully updated notes')
        };
    });

    res.json(noteList);

})


//Fallback route for when a user attempts to visit routes that dont exist
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})


app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
})