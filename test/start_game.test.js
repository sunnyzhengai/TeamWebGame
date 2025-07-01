// test/test_start_game.js
const { create_game, add_player_to_game, start_game, games, players } = require('../services/gameService');

describe('start_game', () => {
  it('should assign players to teams and set game status to in_progress', () => {
    // Create a game and add 7 players
    const game = create_game('Admin');
    const code = game.gameCode;
    const gameId = game.gameId;
    const playerNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    playerNames.forEach(name => add_player_to_game(code, name));

    // Start the game
    const teams = start_game(gameId);

    // There should be 2 teams (5 + 2 players)
    expect(teams.length).toBe(2);
    expect(games[gameId].status).toBe('in_progress');
    expect(games[gameId].teams.length).toBe(2);

    // All players should have a teamId assigned
    teams.forEach(team => {
      team.playerIds.forEach(pid => {
        expect(players[pid].teamId).toBe(team.teamId);
      });
    });
  });

  it('should throw if game not found', () => {
    expect(() => start_game('notarealgame')).toThrow('Game not found');
  });

  it('should throw if no players', () => {
    const game = create_game('Admin2');
    expect(() => start_game(game.gameId)).toThrow('No players to assign');
  });
});
