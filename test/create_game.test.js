// test/test_create_game.js
const { create_game, games } = require('../services/gameService');

describe('create_game', () => {
  it('should return a new game object with gameId and gameCode', () => {
    const adminName = 'Alice';
    const game = create_game(adminName);

    expect(game).toHaveProperty('gameId');
    expect(game).toHaveProperty('gameCode');
    expect(game.adminName).toBe(adminName);
    expect(game.players).toEqual([]);
    expect(game.status).toBe('waiting');
    expect(games[game.gameId]).toEqual(game); // Ensure it's stored
  });
});
