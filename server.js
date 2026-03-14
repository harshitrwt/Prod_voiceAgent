const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Hi from server");
})

app.listen((port), () => {
    console.log("Server runs on port " + port);
})