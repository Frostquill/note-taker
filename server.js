const { notes } = require('./Develop/db/db.json');
const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./Develop/public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));

});

app.get('/notes', function (req,res) {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});



function filterByQuery (query, notesArray) {
    let filResults = notesArray;
    if(query.title) {
        filResults = filResults.filter(note => note.title === query.title);
    }
    if(query.text) {
        filResults = filResults.filter(note => note.text === query.text);
    }
    return filResults;
};

function createNewNote(body, notesArray) {
   const note = body;
   notesArray.push(note);
   fs.writeFileSync(
    path.join(__dirname, './Develop/db/db.json'),
    JSON.stringify({ notes: notesArray}, null, 2)
   ); 
   return note;
};
   

function validateNote (note) {
    if(!note.title || typeof note.title !== 'string') {
        return false;
    }
    if(!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
};

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}


app.get('/api/notes', function (req, res) {
  let results = notes;
 if(req.query) {
     results = filterByQuery(req.query, results);
 } 
  res.json(results);
});

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }
    
});


app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    if(!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
    }
});





app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.listen(PORT, () => {
    // console.log(app);
    console.log(`API server now on ${PORT}!`);
    // console.log(notes);
});