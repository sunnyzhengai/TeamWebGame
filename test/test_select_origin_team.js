const { create_game, add_player_to_game, start_game, select_origin_team, get_current_round, get_team_info } = require('../services/gameService');

// Test the select_origin_team function
function test_select_origin_team() {
  console.log('Testing select_origin_team function...\n');

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

  // Step 5: Get current round
  console.log('5. Getting current round...');
  const currentRound = get_current_round(game.gameId);
  console.log(`   Current round: ${currentRound ? currentRound.roundId : 'None'}\n`);

  // Step 6: Get team info
  console.log('6. Getting team info...');
  const teamInfo = get_team_info(game.gameId, teamId);
  console.log(`   Team ${teamInfo.name}: ${teamInfo.players.map(p => p.playerName).join(', ')}\n`);

  console.log('Test completed successfully!');
}

// Run the test
test_select_origin_team(); 