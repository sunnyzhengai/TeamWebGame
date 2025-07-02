const express = require('express');
const router = express.Router();
const { create_game, add_player_to_game, start_game, select_origin_team, set_round_preferences, submit_origin_ranking, submit_guess, score_guesses, get_scoreboard, get_current_round, end_current_round, get_team_info, declare_winner, games, rounds, players, get_team_details, get_origin_team_info } = require('../services/gameService');

router.post('/create-game', (req, res) => {
  const { adminName, numTeams } = req.body;
  const game = create_game(adminName, numTeams);
  res.json(game);
});

router.post('/add-player', (req, res) => {
  try {
    const { gameCode, playerName } = req.body;
    const player = add_player_to_game(gameCode, playerName);
    res.json(player);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/start-game', (req, res) => {
  try {
    const { gameId } = req.body;
    const result = start_game(gameId);
    res.json({
      success: true,
      teams: result.teams,
      distribution: result.distribution,
      message: `Game started! ${result.distribution.totalPlayers} players assigned to ${result.distribution.numTeams} teams.`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/game-info/:gameCode', (req, res) => {
  try {
    const { gameCode } = req.params;
    const game = Object.values(games).find(g => g.gameCode === gameCode);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json({
      gameId: game.gameId,
      gameCode: game.gameCode,
      adminName: game.adminName,
      playerCount: game.players.length,
      numTeams: game.numTeams,
      status: game.status,
      currentRoundId: game.currentRoundId
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/game-players/:gameCode', (req, res) => {
  try {
    const { gameCode } = req.params;
    const game = Object.values(games).find(g => g.gameCode === gameCode);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const playerList = game.players.map(playerId => {
      const player = players[playerId];
      return {
        playerId: player.playerId,
        playerName: player.playerName,
        teamId: player.teamId,
        joinedAt: player.joinedAt
      };
    });
    
    res.json({
      success: true,
      players: playerList,
      totalPlayers: playerList.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/select-origin-team', (req, res) => {
  try {
    const { gameId, teamId } = req.body;
    if (!gameId || !teamId) {
      return res.status(400).json({ error: 'Game ID and Team ID are required' });
    }
    
    const round = select_origin_team(gameId, teamId);
    res.json({
      success: true,
      round,
      message: `Team ${teamId} selected as origin team for round ${round.roundId}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/current-round/:gameId', (req, res) => {
  try {
    const { gameId } = req.params;
    const round = get_current_round(gameId);
    res.json({ round });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/end-current-round', (req, res) => {
  try {
    const { gameId } = req.body;
    if (!gameId) {
      return res.status(400).json({ error: 'Game ID is required' });
    }
    
    const round = end_current_round(gameId);
    res.json({
      success: true,
      round,
      message: `Round ${round.roundId} ended successfully`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/round-info/:roundId', (req, res) => {
  try {
    const { roundId } = req.params;
    const round = rounds[roundId];
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    
    // Find the game that contains this round
    const game = Object.values(games).find(g => g.rounds && g.rounds.includes(roundId));
    if (game) {
      round.gameCode = game.gameCode;
    }
    
    res.json(round);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/player-info/:playerId', (req, res) => {
  try {
    const { playerId } = req.params;
    const player = players[playerId];
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/team-info/:gameId/:teamId', (req, res) => {
  try {
    const { gameId, teamId } = req.params;
    const teamInfo = get_team_info(gameId, teamId);
    res.json(teamInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/team-details/:gameCode/:teamId', (req, res) => {
  try {
    const { gameCode, teamId } = req.params;
    
    // Find game by gameCode
    const game = Object.values(games).find(g => g.gameCode === gameCode);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const teamDetails = get_team_details(game.gameId, teamId);
    res.json(teamDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/origin-team-info/:roundId', (req, res) => {
  try {
    const { roundId } = req.params;
    const originTeamInfo = get_origin_team_info(roundId);
    res.json({
      success: true,
      originTeam: originTeamInfo
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/set-round-preferences', (req, res) => {
  try {
    const { roundId, category, items } = req.body;
    if (!roundId || !category || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Round ID, category, and items array are required' });
    }
    
    const round = set_round_preferences(roundId, category, items);
    res.json({
      success: true,
      round,
      message: `Round preferences set successfully. Round is now active.`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/submit-origin-ranking', (req, res) => {
  try {
    const { roundId, teamId, orderedItems } = req.body;
    if (!roundId || !teamId || !orderedItems || !Array.isArray(orderedItems)) {
      return res.status(400).json({ error: 'Round ID, team ID, and orderedItems array are required' });
    }
    const round = submit_origin_ranking(roundId, teamId, orderedItems);
    res.json({
      success: true,
      round,
      message: 'Origin team ranking submitted successfully.'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/submit-guess', (req, res) => {
  try {
    const { roundId, teamId, guess } = req.body;
    if (!roundId || !teamId || !guess || !Array.isArray(guess)) {
      return res.status(400).json({ error: 'Round ID, team ID, and guess array are required' });
    }
    
    const round = submit_guess(roundId, teamId, guess);
    res.json({
      success: true,
      round,
      message: `Guess submitted successfully for team ${teamId}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/score-guesses/:roundId', (req, res) => {
  try {
    const { roundId } = req.params;
    const round = rounds[roundId];
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    
    const scores = score_guesses(round);
    res.json({
      success: true,
      scores,
      roundId,
      originRanking: round.originRanking,
      totalGuesses: round.guesses.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/scoreboard/:gameId', (req, res) => {
  try {
    const { gameId } = req.params;
    const scoreboard = get_scoreboard(gameId);
    
    // Convert to array format for easier frontend consumption
    const scoreboardArray = Object.entries(scoreboard).map(([teamId, score]) => ({
      teamId,
      teamName: `Team ${teamId.split('_')[1]}`,
      score
    })).sort((a, b) => b.score - a.score); // Sort by score descending
    
    res.json({
      success: true,
      gameId,
      scoreboard: scoreboardArray,
      totalRounds: games[gameId].rounds.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/declare-winner/:gameId', (req, res) => {
  try {
    const { gameId } = req.params;
    const result = declare_winner(gameId);
    
    // Handle case when there are no scores yet
    if (result.noScores) {
      return res.json({
        success: true,
        gameId,
        winners: [],
        maxScore: 0,
        isTie: false,
        noScores: true,
        message: "No scores yet! Play some rounds first to determine a winner."
      });
    }
    
    // Convert team IDs to team names for better display
    const winners = result.winners.map(teamId => ({
      teamId,
      teamName: `Team ${teamId.split('_')[1]}`
    }));
    
    res.json({
      success: true,
      gameId,
      winners,
      maxScore: result.maxScore,
      isTie: winners.length > 1,
      message: winners.length === 1 
        ? `Winner: ${winners[0].teamName} with ${result.maxScore} points!`
        : `It's a tie! ${winners.map(w => w.teamName).join(', ')} all have ${result.maxScore} points!`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/debug/games', (req, res) => {
  try {
    const gameList = Object.values(games).map(game => ({
      gameId: game.gameId,
      gameCode: game.gameCode,
      adminName: game.adminName,
      playerCount: game.players.length,
      status: game.status
    }));
    
    res.json({
      success: true,
      games: gameList,
      totalGames: gameList.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/debug/rounds', (req, res) => {
  try {
    const roundList = Object.values(rounds).map(round => ({
      roundId: round.roundId,
      gameId: round.gameId,
      originTeamId: round.originTeamId,
      status: round.status,
      category: round.category,
      items: round.items
    }));
    
    res.json({
      success: true,
      rounds: roundList,
      totalRounds: roundList.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/refresh-scores/:roundId', (req, res) => {
  try {
    const { roundId } = req.params;
    const round = rounds[roundId];
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    
    if (!round.originRanking) {
      return res.status(400).json({ error: 'Origin team has not submitted ranking yet' });
    }
    
    const scores = score_guesses(round);
    const totalGuesses = round.guesses.length;
    
    res.json({
      success: true,
      roundId,
      scores,
      totalGuesses,
      originRanking: round.originRanking,
      message: `Scores refreshed! ${totalGuesses} guesses scored against origin ranking.`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 