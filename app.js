const express = require('express');
const cors = require('cors');
const path = require('path');

// Try to reset data, but don't crash if it fails
try {
  const resetGameData = require('./resetData');
  resetGameData(); // 💣 Clears data on every server restart
} catch (error) {
  console.error('❌ [Startup] Error during data reset:', error.message);
  // Continue with server startup even if reset fails
}

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