const express = require('express');
const fs = require('fs');
const PORT = 3001;
const app = express();

app.get('/api/notes', function (req, res) {
    res.sendFile(__dirname, './db/db.json');
})




app.listen(PORT, () => {
    console.log(app);
    console.log(`API server now on ${PORT}!`);
});