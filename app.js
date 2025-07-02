const express = require('express');
const resetGameData = require('./resetData');
resetGameData(); // 💣 Clears data on every server restart
const cors = require('cors');
const path = require('path');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api', gameRoutes);

// Serve home page as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Handle all other routes by serving the home page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 