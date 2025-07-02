// resetData.js - Clears all in-memory game data on server startup
const { games, players, rounds } = require('./services/gameService');

function resetGameData() {
  try {
    // Clear all in-memory data structures
    if (games && typeof games === 'object') {
      Object.keys(games).forEach(key => delete games[key]);
    }
    if (players && typeof players === 'object') {
      Object.keys(players).forEach(key => delete players[key]);
    }
    if (rounds && typeof rounds === 'object') {
      Object.keys(rounds).forEach(key => delete rounds[key]);
    }
    
    console.log('🧹 [Reset] Cleared all game data on startup');
    console.log(`   - Games: ${games ? Object.keys(games).length : 0}`);
    console.log(`   - Players: ${players ? Object.keys(players).length : 0}`);
    console.log(`   - Rounds: ${rounds ? Object.keys(rounds).length : 0}`);
  } catch (error) {
    console.error('❌ [Reset] Error during data reset:', error.message);
    // Don't throw the error - just log it and continue
  }
}

module.exports = resetGameData; 