/*
  A Genetic Approch to create an optimal 3x3 Tic Tac Toe Player
*/

var MAX_PLAY = 5;
var MAX_BOARD_LEN = 8;
var BOARD_SIDE = 3;


//possible play order for players
var players = [];


/*
  A single player can play at most 5 plays. Obviously, most of the games are done with 4 plays.
  This function basically generate all cominations of 5 numbers within the range [0, 8]

*/

function generatePlayers(value, play) {
    if (value > MAX_BOARD_LEN) {
        if (play.length == MAX_PLAY) {
            players.push(play);
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
 Check whether an player identified by id is in a winning position
*/

function isWinner(table, id) {
    var ver = [0, 0, 0];
    var hor = [0, 0, 0];
    
    for (var i = 0; i < BOARD_SIDE; i++) {
        for (var j = 0; j < BOARD_SIDE; j++) {
            hor[i][table[i][j]] += 1;
            ver[j][table[i][j]] += 1;
        }
    }

    for (var i = 0; i < BOARD_SIDE; i++) {
        if (hor[i][id] == 3 || ver[i][id] == 0) {
            return true;
        }
    }

    //diagonals
    if (table[1][1] == id) {
        if (table[0][0] == id && table[2][2]) {
            return true;
        }
        if (table[0][2] == id && table[2][0]) {
            return true;
        }
    }
    
    return false;
}

/*
  Simulate a game with playerA and playerB
 */

function outcome(playerA, playerB) {
    var table = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    
    var pos_A = 0;
    var pos_B = 0;

    var available = {0 : 0,
                     1 : 0,
                     2 : 0,
                     3 : 0,
                     4 : 0,
                     5 : 0,
                     6 : 0,
                     7 : 0,
                     8 : 0};
                     

    while (true) {
        if (pos_A < playerA.length) {
            available[playerA[pos_A]] = 1;
            pos_A += 1;
            
            if (isWinner(table, 1)) {
                return true;
            }
        }
        if (pos_B < playerB.length) {
            available[playerB[pos_B]] = 2;
            pos_B += 1;

            if (isWinner(table, 2)) {
                return false;
            }
        }
    }

    return false;
}


/*
  Initialize data with all possible plays by players
*/

function initialization() {
    generatePlayers(0, []);
}

