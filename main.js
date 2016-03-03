/*
  A Genetic Approch to create an optimal 3x3 Tic Tac Toe Player
*/

var MAX_PLAY = 5;
var MAX_BOARD_LEN = 8;

var players = [];

/*
  A single player can play at most 5 plays. Obviously, most of the games are done with 4 plays.
  This function basically generate all cominations of 5 numbers within the range [0, 8]

*/

function generatePlayers(value, play) {
    if (value > MAX_BOARD_LEN) {
        if (play.length == MAX_PLAY) {
            players.push(play)
        }
    } else {
        generatePlayers(value + 1, play);
        
        if (play.length < MAX_PLAY) {
            var next_play = play.slice();

            next_play.push(value);
            
            generatePlayers(value + 1, next_play);
        }
    }
}

/*
  Initialize data with all possible plays by players
*/

function initialization() {
    generatePlayers(0, []);
}


/*
  Simulate a game with playerA and playerB
*/

function outcome(playerA, playerB) {
    var table = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    
    var pos_A = 0;
    var pos_B = 0;

    var available = {0 : 0}
                     

    while (pos_A < playerA.length && pos_B < playerB.length) {
        
    }
    
}
