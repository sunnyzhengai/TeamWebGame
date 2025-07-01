const { create_game, add_player_to_game, start_game, select_origin_team, set_round_preferences, get_current_round } = require('../services/gameService');

// Test the set_round_preferences function
function test_set_round_preferences() {
  console.log('Testing set_round_preferences function...\n');

  // Step 1: Create a game
  console.log('1. Creating game...');
  const game = create_game('TestAdmin');
  console.log(`   Game created: ${game.gameId} (Code: ${game.gameCode})\n`);

  // Step 2: Add some players
  console.log('2. Adding players...');
  const player1 = add_player_to_game(game.gameCode, 'Player1');
  const player2 = add_player_to_game(game.gameCode, 'Player2');
  const player3 = add_player_to_game(game.gameCode, 'Player3');
  const player4 = add_player_to_game(game.gameCode, 'Player4');
  console.log(`   Added players: ${player1.playerName}, ${player2.playerName}, ${player3.playerName}, ${player4.playerName}\n`);

  // Step 3: Start the game
  console.log('3. Starting game...');
  const teams = start_game(game.gameId);
  console.log(`   Teams created: ${teams.map(t => t.name).join(', ')}\n`);

  // Step 4: Select origin team
  console.log('4. Selecting origin team...');
  const teamId = teams[0].teamId; // Select first team
  const round = select_origin_team(game.gameId, teamId);
  console.log(`   Origin team selected: ${teamId}`);
  console.log(`   Round created: ${round.roundId}`);
  console.log(`   Round status: ${round.status}\n`);

  // Step 5: Set round preferences
  console.log('5. Setting round preferences...');
  const category = 'Movies';
  const items = ['The Matrix', 'Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction'];
  
  const updatedRound = set_round_preferences(round.roundId, category, items);
  console.log(`   Category set: ${updatedRound.category}`);
  console.log(`   Items set: ${updatedRound.items.join(', ')}`);
  console.log(`   Round status: ${updatedRound.status}\n`);

  // Step 6: Verify current round
  console.log('6. Verifying current round...');
  const currentRound = get_current_round(game.gameId);
  console.log(`   Current round category: ${currentRound.category}`);
  console.log(`   Current round items: ${currentRound.items.join(', ')}`);
  console.log(`   Current round status: ${currentRound.status}\n`);

  console.log('Test completed successfully!');
}

// Run the test
test_set_round_preferences(); 