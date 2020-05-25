//required modules
const express = require('express');
const fs = require('fs');
const path = require('path');

//represents the port to 3001
const PORT = process.env.PORT || 3001;

const app = express();

//used to parse incoming data as well as JSON data, and the middleware for the 'public' folder
app.use(express.urlencoded ({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//request data from db.json
const { notes } = require('./db/notes.json');

//function to create a new Note
function createNewNote (body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/notes.json'),
        JSON.stringify({ notes : notesArray }, null, 2)
    );

    return note;
};

//function to validate the input of the note
function inputValidate (note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
};

//request to get all notes as json data
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

//request to send back all notes after validating the input
app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();

    if (!inputValidate(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
        const note = createNewNote(req.body, notes);

        res.json(note);
    }
});

//route to Index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//route to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//listener for the server 3001
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});



