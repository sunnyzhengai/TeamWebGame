// services/gameService.js
const fs = require('fs');
const path = require('path');

// File paths for persistent storage
const GAMES_FILE = path.join(__dirname, '..', 'data', 'games.json');
const ROUNDS_FILE = path.join(__dirname, '..', 'data', 'rounds.json');
const PLAYERS_FILE = path.join(__dirname, '..', 'data', 'players.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load data from files or initialize empty objects
function loadData() {
  try {
    const games = fs.existsSync(GAMES_FILE) ? JSON.parse(fs.readFileSync(GAMES_FILE, 'utf8')) : {};
    const rounds = fs.existsSync(ROUNDS_FILE) ? JSON.parse(fs.readFileSync(ROUNDS_FILE, 'utf8')) : {};
    const players = fs.existsSync(PLAYERS_FILE) ? JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8')) : {};
    return { games, rounds, players };
  } catch (error) {
    console.error('Error loading data:', error);
    return { games: {}, rounds: {}, players: {} };
  }
}

// Save data to files
function saveData(games, rounds, players) {
  try {
    fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2));
    fs.writeFileSync(ROUNDS_FILE, JSON.stringify(rounds, null, 2));
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Initialize data
let { games, rounds, players } = loadData();

function create_game(adminName, numTeams = 2) {
  const gameId = Date.now().toString();
  const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const game = {
    gameId,
    gameCode,
    adminName,
    numTeams,
    players: [],
    teams: [],
    teamDetails: [],
    rounds: [],
    currentRoundId: null,
    status: 'waiting', // waiting, in_progress, completed
    createdAt: new Date().toISOString()
  };
  
  games[gameId] = game;
  saveData(games, rounds, players);
  
  return game;
}

function add_player_to_game(gameCode, playerName) {
  const game = Object.values(games).find(g => g.gameCode === gameCode);
  if (!game) throw new Error('Game not found');

  const playerId = Date.now().toString();
  const player = {
    playerId,
    playerName,
    teamId: null, // Will be assigned when game starts
    gameId: game.gameId,
    joinedAt: new Date().toISOString()
  };

  players[playerId] = player;
  game.players.push(playerId);
  saveData(games, rounds, players);
  return player;
}

function start_game(gameId) {
  const game = games[gameId];
  if (!game) throw new Error('Game not found');
  if (game.players.length === 0) throw new Error('No players to assign');

  const numTeams = game.numTeams || 2; // Default to 2 teams if not specified
  const totalPlayers = game.players.length;
  
  // Calculate optimal team distribution
  const baseTeamSize = Math.floor(totalPlayers / numTeams);
  const remainder = totalPlayers % numTeams;
  
  // Shuffle players for random assignment
  const shuffled = [...game.players].sort(() => Math.random() - 0.5);
  const teams = [];
  
  let playerIndex = 0;
  
  for (let i = 0; i < numTeams; i++) {
    // Calculate team size: base size + 1 extra player if there's remainder
    const teamSize = baseTeamSize + (i < remainder ? 1 : 0);
    const teamPlayers = shuffled.slice(playerIndex, playerIndex + teamSize);
    const teamId = `team_${i + 1}`; // Changed from team_${i} to team_${i + 1}

    // Assign team to players
    teamPlayers.forEach(pid => players[pid].teamId = teamId);

    // Randomly select a team lead from the team players
    const randomIndex = Math.floor(Math.random() * teamPlayers.length);
    const leadId = teamPlayers[randomIndex];

    const team = {
      teamId,
      name: `Team ${i + 1}`,
      playerIds: teamPlayers,
      leadId: leadId,
      score: 0
    };
    teams.push(team);
    
    playerIndex += teamSize;
  }

  game.teams = teams.map(t => t.teamId);
  game.teamDetails = teams; // Store full team details
  game.status = 'in_progress';
  
  saveData(games, rounds, players);
  
  return {
    teams,
    distribution: {
      totalPlayers,
      numTeams,
      baseTeamSize,
      remainder,
      teamSizes: teams.map(t => t.playerIds.length)
    }
  };
}

function select_origin_team(gameId, teamId) {
  const game = games[gameId];
  if (!game) throw new Error('Game not found');
  if (!game.teams.includes(teamId)) throw new Error('Invalid team');
  if (game.status !== 'in_progress') throw new Error('Game must be in progress to select origin team');
  if (game.currentRoundId) throw new Error('A round is already in progress');

  const roundId = Date.now().toString();
  const round = {
    roundId,
    originTeamId: teamId,
    category: null,
    items: [],
    originRanking: null,
    guesses: [],
    status: 'setup', // setup, active, completed
    createdAt: new Date().toISOString()
  };

  rounds[roundId] = round;
  game.rounds.push(roundId);
  game.currentRoundId = roundId;

  saveData(games, rounds, players);
  return round;
}

function set_round_preferences(roundId, category, items) {
  const round = rounds[roundId];
  if (!round) throw new Error('Round not found');
  if (round.status !== 'setup') throw new Error('Round must be in setup status to set preferences');

  round.category = category;
  round.items = items;
  round.status = 'active'; // Move to active status after preferences are set
  saveData(games, rounds, players);
  return round;
}

function submit_origin_ranking(roundId, teamId, orderedItems) {
  const round = rounds[roundId];
  if (!round) throw new Error('Round not found');
  if (round.originTeamId !== teamId) throw new Error('Only origin team can submit');
  if (round.originRanking) throw new Error('Ranking already submitted');

  round.originRanking = orderedItems;
  saveData(games, rounds, players);
  return round;
}

function submit_guess(roundId, teamId, guess) {
  const round = rounds[roundId];
  if (!round) throw new Error('Round not found');
  if (round.originTeamId === teamId) throw new Error('Origin team cannot guess');
  if (!Array.isArray(guess) || guess.length !== round.items.length) throw new Error('Invalid guess format');

  // Count existing guesses for this team
  const existingGuesses = round.guesses.filter(g => g.teamId === teamId);
  if (existingGuesses.length >= 3) {
    throw new Error('This team has already used all 3 attempts');
  }

  round.guesses.push({ teamId, guess });
  saveData(games, rounds, players);
  return round;
}

function score_guesses(round) {
  if (!round.originRanking || !round.guesses) return [];

  return round.guesses.map(({ teamId, guess }) => {
    const score = guess.reduce((sum, item, index) => {
      return sum + (item === round.originRanking[index] ? 1 : 0);
    }, 0);
    return { teamId, score };
  });
}

function get_current_round(gameId) {
  const game = games[gameId];
  if (!game) throw new Error('Game not found');
  if (!game.currentRoundId) return null;
  
  return rounds[game.currentRoundId];
}

function end_current_round(gameId) {
  const game = games[gameId];
  if (!game) throw new Error('Game not found');
  if (!game.currentRoundId) throw new Error('No round in progress');
  
  const round = rounds[game.currentRoundId];
  if (round) {
    round.status = 'completed';
  }
  
  game.currentRoundId = null;
  saveData(games, rounds, players);
  return round;
}

function get_team_info(gameId, teamId) {
  const game = games[gameId];
  if (!game) throw new Error('Game not found');
  
  const teamPlayers = game.players.filter(pid => players[pid].teamId === teamId);
  const uniquePlayers = teamPlayers.map(pid => players[pid]);
  
  return {
    teamId,
    name: `Team ${teamId.split('_')[1]}`, // This now correctly shows Team 1 for team_1
    playerIds: teamPlayers,
    players: uniquePlayers
  };
}

function get_team_details(gameId, teamId) {
  const game = games[gameId];
  if (!game) throw new Error('Game not found');
  
  // Get team details from stored team details
  const teamDetail = game.teamDetails ? game.teamDetails.find(t => t.teamId === teamId) : null;
  
  if (!teamDetail) {
    // Fallback to basic team info if team details not available
    const teamPlayers = game.players.filter(pid => players[pid].teamId === teamId);
    const uniquePlayers = teamPlayers.map(pid => players[pid]);
    
    return {
      teamId,
      name: `Team ${teamId.split('_')[1]}`, // This now correctly shows Team 1 for team_1
      playerIds: teamPlayers,
      players: uniquePlayers,
      leadId: teamPlayers[0], // Fallback: first player
      leadName: teamPlayers[0] ? players[teamPlayers[0]].playerName : 'Unknown'
    };
  }
  
  const uniquePlayers = teamDetail.playerIds.map(pid => players[pid]);
  
  return {
    teamId: teamDetail.teamId,
    name: teamDetail.name,
    playerIds: teamDetail.playerIds,
    players: uniquePlayers,
    leadId: teamDetail.leadId,
    leadName: players[teamDetail.leadId] ? players[teamDetail.leadId].playerName : 'Unknown'
  };
}

function get_scoreboard(gameId) {
  const game = games[gameId];
  if (!game) throw new Error('Game not found');

  const scoreboard = {};

  game.rounds.forEach(roundId => {
    const round = rounds[roundId];
    const scores = score_guesses(round);
    
    // Group scores by team and sum all scores for each team
    const teamTotalScores = {};
    scores.forEach(({ teamId, score }) => {
      if (!teamTotalScores[teamId]) {
        teamTotalScores[teamId] = 0;
      }
      teamTotalScores[teamId] += score;
    });
    
    // Add total scores to overall scoreboard
    Object.entries(teamTotalScores).forEach(([teamId, score]) => {
      if (!scoreboard[teamId]) scoreboard[teamId] = 0;
      scoreboard[teamId] += score;
    });
  });

  return scoreboard;
}

function declare_winner(gameId) {
  const scoreboard = get_scoreboard(gameId);
  
  // Check if there are any scores
  if (Object.keys(scoreboard).length === 0) {
    return { winners: [], maxScore: 0, noScores: true };
  }
  
  let maxScore = -1;
  let winners = [];

  for (const [teamId, score] of Object.entries(scoreboard)) {
    if (score > maxScore) {
      maxScore = score;
      winners = [teamId];
    } else if (score === maxScore) {
      winners.push(teamId);
    }
  }

  return { winners, maxScore };
}

function get_origin_team_info(roundId) {
  const round = rounds[roundId];
  if (!round) throw new Error("Round not found");

  // Find the game that contains this round
  const game = Object.values(games).find(g => g.rounds && g.rounds.includes(roundId));
  if (!game) throw new Error("Game not found");

  const team = game.teamDetails?.find(t => t.teamId === round.originTeamId);
  if (!team) throw new Error("Origin team not found");

  const memberNames = team.playerIds.map(pid => players[pid]?.playerName || 'Unknown');
  
  return { 
    teamId: team.teamId,
    teamName: team.name, 
    memberNames,
    leadName: players[team.leadId]?.playerName || 'Unknown'
  };
}

module.exports = {
  create_game,
  add_player_to_game,
  start_game,
  select_origin_team,
  set_round_preferences,
  submit_origin_ranking,
  submit_guess,
  score_guesses,
  get_scoreboard,
  get_current_round,
  end_current_round,
  get_team_info,
  get_team_details,
  declare_winner,
  get_origin_team_info,
  games,  // exported for testing/inspection
  players,  // exported for testing/inspection
  rounds   // exported for testing/inspection
};
