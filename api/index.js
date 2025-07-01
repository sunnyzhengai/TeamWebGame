const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Serve other pages
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

app.get('/join', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/join.html'));
});

// Catch all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

module.exports = app; 