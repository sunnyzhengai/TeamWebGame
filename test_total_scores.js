// test_total_scores.js
async function testTotalScores() {
    console.log('Testing total scores system...');
    
    try {
        // Test 1: Create a game
        const createRes = await fetch('http://localhost:4000/api/create-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminName: 'TestAdmin', numTeams: 2 })
        });
        const createData = await createRes.json();
        
        if (!createRes.ok) {
            throw new Error(`Failed to create game: ${createData.error}`);
        }
        
        console.log('✅ Game created:', createData.gameCode);
        
        // Test 2: Add players
        const playerNames = ['Alice', 'Bob', 'Charlie', 'David'];
        for (const name of playerNames) {
            const playerRes = await fetch('http://localhost:4000/api/add-player', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameCode: createData.gameCode, playerName: name })
            });
            const playerData = await playerRes.json();
            console.log(`✅ Player ${name} added:`, playerData.playerId);
        }
        
        // Test 3: Start the game
        const startRes = await fetch('http://localhost:4000/api/start-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId: createData.gameId })
        });
        const startData = await startRes.json();
        
        if (!startRes.ok) {
            throw new Error(`Failed to start game: ${startData.error}`);
        }
        
        console.log('✅ Game started with teams:', startData.teams.map(t => `${t.name} (${t.teamId})`));
        
        // Test 4: Create round with Team 1 as origin
        const roundRes = await fetch('http://localhost:4000/api/select-origin-team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId: createData.gameId, teamId: 'team_1' })
        });
        const roundData = await roundRes.json();
        
        if (!roundRes.ok) {
            throw new Error(`Failed to create round: ${roundData.error}`);
        }
        
        console.log('✅ Round created:', roundData.round.roundId);
        
        // Test 5: Set round preferences
        const prefRes = await fetch('http://localhost:4000/api/set-round-preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                roundId: roundData.round.roundId, 
                category: 'Movies', 
                items: ['Star Wars', 'Lord of the Rings', 'Harry Potter', 'Marvel'] 
            })
        });
        const prefData = await prefRes.json();
        
        if (!prefRes.ok) {
            throw new Error(`Failed to set preferences: ${prefData.error}`);
        }
        
        console.log('✅ Round preferences set');
        
        // Test 6: Submit origin ranking
        const originRes = await fetch('http://localhost:4000/api/submit-origin-ranking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                roundId: roundData.round.roundId, 
                teamId: 'team_1', 
                orderedItems: ['Star Wars', 'Lord of the Rings', 'Harry Potter', 'Marvel'] 
            })
        });
        const originData = await originRes.json();
        
        if (!originRes.ok) {
            throw new Error(`Failed to submit origin ranking: ${originData.error}`);
        }
        
        console.log('✅ Origin ranking submitted');
        
        // Test 7: Submit multiple guesses from Team 2
        // First guess: 2/4 correct
        const guess1Res = await fetch('http://localhost:4000/api/submit-guess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                roundId: roundData.round.roundId, 
                teamId: 'team_2', 
                guess: ['Star Wars', 'Lord of the Rings', 'Marvel', 'Harry Potter'] 
            })
        });
        const guess1Data = await guess1Res.json();
        
        if (!guess1Res.ok) {
            throw new Error(`Failed to submit guess 1: ${guess1Data.error}`);
        }
        
        console.log('✅ Team 2 first guess submitted (should get 2/4)');
        
        // Second guess: 3/4 correct
        const guess2Res = await fetch('http://localhost:4000/api/submit-guess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                roundId: roundData.round.roundId, 
                teamId: 'team_2', 
                guess: ['Star Wars', 'Lord of the Rings', 'Harry Potter', 'Marvel'] 
            })
        });
        const guess2Data = await guess2Res.json();
        
        if (!guess2Res.ok) {
            throw new Error(`Failed to submit guess 2: ${guess2Data.error}`);
        }
        
        console.log('✅ Team 2 second guess submitted (should get 4/4)');
        
        // Third guess: 1/4 correct
        const guess3Res = await fetch('http://localhost:4000/api/submit-guess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                roundId: roundData.round.roundId, 
                teamId: 'team_2', 
                guess: ['Marvel', 'Star Wars', 'Lord of the Rings', 'Harry Potter'] 
            })
        });
        const guess3Data = await guess3Res.json();
        
        if (!guess3Res.ok) {
            throw new Error(`Failed to submit guess 3: ${guess3Data.error}`);
        }
        
        console.log('✅ Team 2 third guess submitted (should get 1/4)');
        
        // Test 8: Check individual round scores
        console.log('\n--- Individual Round Scores ---');
        const scoreRes = await fetch(`http://localhost:4000/api/score-guesses/${roundData.round.roundId}`);
        const scoreData = await scoreRes.json();
        
        if (!scoreRes.ok) {
            throw new Error(`Failed to get scores: ${scoreData.error}`);
        }
        
        console.log('Individual guess scores:', scoreData.scores);
        console.log('Expected: Team 2 should have scores [2, 4, 1]');
        
        // Test 9: Check overall scoreboard
        console.log('\n--- Overall Scoreboard ---');
        const scoreboardRes = await fetch(`http://localhost:4000/api/scoreboard/${createData.gameId}`);
        const scoreboardData = await scoreboardRes.json();
        
        if (!scoreboardRes.ok) {
            throw new Error(`Failed to get scoreboard: ${scoreboardData.error}`);
        }
        
        console.log('Overall scoreboard:', scoreboardData.scoreboard);
        console.log('Expected: Team 2 should have total score 7 (2+4+1)');
        
        // Test 10: Check winner
        console.log('\n--- Winner ---');
        const winnerRes = await fetch(`http://localhost:4000/api/declare-winner/${createData.gameId}`);
        const winnerData = await winnerRes.json();
        
        if (!winnerRes.ok) {
            throw new Error(`Failed to get winner: ${winnerData.error}`);
        }
        
        console.log('Winner data:', winnerData);
        console.log('Expected: Team 2 should win with 7 points');
        
        // Verify the results
        const team2Score = scoreboardData.scoreboard.find(t => t.teamId === 'team_2')?.score || 0;
        const individualScores = scoreData.scores.filter(s => s.teamId === 'team_2').map(s => s.score);
        const totalFromIndividual = individualScores.reduce((sum, score) => sum + score, 0);
        
        console.log('\n--- Verification ---');
        console.log(`Team 2 individual scores: ${individualScores.join(', ')}`);
        console.log(`Team 2 total from individual: ${totalFromIndividual} (expected: 7)`);
        console.log(`Team 2 scoreboard total: ${team2Score} (expected: 7)`);
        console.log(`Winner max score: ${winnerData.maxScore} (expected: 7)`);
        console.log(`Winner team: ${winnerData.winners[0]?.teamName} (expected: Team 2)`);
        
        if (totalFromIndividual === 7 && team2Score === 7 && winnerData.maxScore === 7) {
            console.log('✅ Total scores are working correctly!');
        } else {
            console.log('❌ Score mismatch detected!');
        }
        
        console.log('\n🎉 Total scores test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testTotalScores(); 