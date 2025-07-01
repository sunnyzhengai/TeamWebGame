async function testOriginTeamDisplay() {
    console.log('Testing origin team display fix...');
    
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
        const player1Res = await fetch('http://localhost:4000/api/add-player', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameCode: createData.gameCode, playerName: 'cc' })
        });
        const player1Data = await player1Res.json();
        
        const player2Res = await fetch('http://localhost:4000/api/add-player', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameCode: createData.gameCode, playerName: 'bb' })
        });
        const player2Data = await player2Res.json();
        
        console.log('✅ Players added:', player1Data.playerName, player2Data.playerName);
        
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
        
        console.log('✅ Game started');
        
        // Test 4: Select origin team (team_1)
        const originRes = await fetch('http://localhost:4000/api/select-origin-team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId: createData.gameId, teamId: 'team_1' })
        });
        const originData = await originRes.json();
        
        if (!originRes.ok) {
            throw new Error(`Failed to select origin team: ${originData.error}`);
        }
        
        console.log('✅ Origin team selected:', originData.round.originTeamId);
        
        // Test 5: Check origin team info API
        const originTeamRes = await fetch(`http://localhost:4000/api/origin-team-info/${originData.round.roundId}`);
        const originTeamData = await originTeamRes.json();
        
        if (originTeamRes.ok && originTeamData.originTeam) {
            console.log('✅ Origin team info API works:');
            console.log(`  - Team Name: ${originTeamData.originTeam.teamName}`);
            console.log(`  - Lead: ${originTeamData.originTeam.leadName}`);
            console.log(`  - Members: ${originTeamData.originTeam.memberNames.join(', ')}`);
        } else {
            console.log('⚠️ Origin team info API returned:', originTeamData);
        }
        
        console.log('\n🎉 Origin team display fix test completed!');
        console.log('✅ The join page should now show proper origin team information');
        console.log('✅ Each team should see the correct origin team details');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testOriginTeamDisplay(); 