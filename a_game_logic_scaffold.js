// backend/services/gameService.js
function create_game(adminName) {
    // TODO: create gameId, gameCode, store in memory or DB
  }
  
  function add_player_to_game(gameCode, playerName) {
    // TODO: lookup game, add player object, return playerId
  }
  
  function start_game(gameId) {
    // TODO: assign players to teams and set game status
  }
  
  function select_origin_team(gameId, teamId) {
    // TODO: mark origin team in game state
  }
  
  function create_round(gameId, teamId) {
    // TODO: create a new round linked to origin team
  }
  
  function set_round_preferences(roundId, category, items) {
    // TODO: store the chosen category and 4 items
  }
  
  function submit_origin_ranking(roundId, teamId, orderedItems) {
    // TODO: save the answer key submitted by origin team
  }
  
  function submit_guess(roundId, teamId, guess) {
    // TODO: accept and validate guess
  }
  
  function score_guesses(roundId) {
    // TODO: compare each guess to origin and calculate scores
  }
  
  function get_scoreboard(gameId) {
    // TODO: summarize scores by team
  }
  
  function declare_winner(gameId) {
    // TODO: identify top scoring team
  }
  
  module.exports = {
    create_game,
    add_player_to_game,
    start_game,
    select_origin_team,
    create_round,
    set_round_preferences,
    submit_origin_ranking,
    submit_guess,
    score_guesses,
    get_scoreboard,
    declare_winner,
  };
  