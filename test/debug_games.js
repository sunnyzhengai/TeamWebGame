const { games, players, rounds } = require('../services/gameService');

console.log('=== DEBUG: Current Game State ===\n');

console.log('Games in memory:');
if (Object.keys(games).length === 0) {
  console.log('  No games found in memory');
} else {
  Object.values(games).forEach(game => {
    console.log(`  Game ID: ${game.gameId}`);
    console.log(`  Game Code: ${game.gameCode}`);
    console.log(`  Admin: ${game.adminName}`);
    console.log(`  Status: ${game.status}`);
    console.log(`  Players: ${game.players.length}`);
    console.log(`  Teams: ${game.teams.length}`);
    console.log(`  Rounds: ${game.rounds.length}`);
    console.log(`  Current Round: ${game.currentRoundId || 'None'}`);
    console.log('  ---');
  });
}

console.log('\nPlayers in memory:');
if (Object.keys(players).length === 0) {
  console.log('  No players found in memory');
} else {
  Object.values(players).forEach(player => {
    console.log(`  Player ID: ${player.playerId}`);
    console.log(`  Name: ${player.playerName}`);
    console.log(`  Game ID: ${player.gameId}`);
    console.log(`  Team ID: ${player.teamId || 'None'}`);
    console.log('  ---');
  });
}

console.log('\nRounds in memory:');
if (Object.keys(rounds).length === 0) {
  console.log('  No rounds found in memory');
} else {
  Object.values(rounds).forEach(round => {
    console.log(`  Round ID: ${round.roundId}`);
    console.log(`  Origin Team: ${round.originTeamId}`);
    console.log(`  Status: ${round.status}`);
    console.log(`  Category: ${round.category || 'Not set'}`);
    console.log(`  Items: ${round.items && round.items.length > 0 ? round.items.join(', ') : 'Not set'}`);
    console.log('  ---');
  });
}

console.log('\n=== End Debug ==='); 