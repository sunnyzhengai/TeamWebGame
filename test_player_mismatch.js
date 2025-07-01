async function testPlayerMismatchFix() {
    console.log('Testing player mismatch fix...');
    
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
        
        // Test 2: Add player "bb"
        const player1Res = await fetch('http://localhost:4000/api/add-player', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameCode: createData.gameCode, playerName: 'bb' })
        });
        const player1Data = await player1Res.json();
        
        if (!player1Res.ok) {
            throw new Error(`Failed to add player bb: ${player1Data.error}`);
        }
        
        console.log('✅ Player bb added:', player1Data.playerId);
        
        // Test 3: Add player "cc"
        const player2Res = await fetch('http://localhost:4000/api/add-player', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameCode: createData.gameCode, playerName: 'cc' })
        });
        const player2Data = await player2Res.json();
        
        if (!player2Res.ok) {
            throw new Error(`Failed to add player cc: ${player2Data.error}`);
        }
        
        console.log('✅ Player cc added:', player2Data.playerId);
        
        // Test 4: Verify player info API works correctly
        const verify1Res = await fetch(`http://localhost:4000/api/player-info/${player1Data.playerId}`);
        const verify1Data = await verify1Res.json();
        
        const verify2Res = await fetch(`http://localhost:4000/api/player-info/${player2Data.playerId}`);
        const verify2Data = await verify2Res.json();
        
        console.log('✅ Player verification:');
        console.log(`  - Player ${player1Data.playerId}: ${verify1Data.playerName}`);
        console.log(`  - Player ${player2Data.playerId}: ${verify2Data.playerName}`);
        
        if (verify1Data.playerName !== 'bb' || verify2Data.playerName !== 'cc') {
            throw new Error('Player name verification failed');
        }
        
        console.log('\n🎉 Player mismatch fix test completed successfully!');
        console.log('✅ The join page should now correctly maintain player data');
        console.log('✅ The "Go to Round" button should use the correct player ID');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testPlayerMismatchFix(); 