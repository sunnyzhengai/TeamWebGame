// resetData.js - Clears all in-memory game data on server startup
const { games, players, rounds } = require('./services/gameService');

function resetGameData() {
  // Clear all in-memory data structures
  Object.keys(games).forEach(key => delete games[key]);
  Object.keys(players).forEach(key => delete players[key]);
  Object.keys(rounds).forEach(key => delete rounds[key]);
  
  console.log('🧹 [Reset] Cleared all game data on startup');
  console.log(`   - Games: ${Object.keys(games).length}`);
  console.log(`   - Players: ${Object.keys(players).length}`);
  console.log(`   - Rounds: ${Object.keys(rounds).length}`);
}

module.exports = resetGameData; 