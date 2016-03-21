/*
  A Genetic Approch to create an optimal 3x3 Tic Tac Toe Player

  The algorithm consists of simulating an evolutive process of position choices in the board.

  Beginning with 50 randomly generated players, it keeps improving newer players based on best players from previous generations.
*/

<<<<<<< HEAD
var MAX_PLAYERS = 50;
var BOARD_SIDE_LEN = 3;
=======
var MAX_PLAY = 5;
var MAX_BOARD_LEN = 8;
var BOARD_SIDE = 3;
>>>>>>> 0dce097f221d942062280e57a0bb9e6db1047bf4


//possible play order for players
var players = [];


/*
  Check whether a board has a winner. As win state is run after each play, if there's a winner, it will be only one.

  0. No winner at all
  1. Player 1 wins
  2. Player 2 wins

<<<<<<< HEAD
 */

function hasWinner(board) {
    var winner = 0;

    var ver_cnt = [[0, 0], [0, 0], [0, 0]];
    var hor_cnt = [[0, 0], [0, 0], [0, 0]];
=======
function generatePlayers(value, play) {
    if (value > MAX_BOARD_LEN) {
        if (play.length == MAX_PLAY) {
            players.push(play);
        }
    } else {
        generatePlayers(value + 1, play);
        
        if (play.length < MAX_PLAY) {
            var next_play = play.slice();
>>>>>>> 0dce097f221d942062280e57a0bb9e6db1047bf4

    for (var i = 0; i < BOARD_SIDE_LEN; i++) {
        for (var j = 0; j < BOARD_SIDE_LEN; j++) {
            ver_cnt[j][board[i][j]] += 1;
            hor_cnt[i][board[i][j]] += 1;
        }
    }

<<<<<<< HEAD
    for (var i = 0; i < BOARD_SIDE_LEN; i++) {
        for (var j = 1; j <= 2; j++) {
            if (ver_cnt[i][j] == BOARD_SIDE_LEN) {
                winner = j;
            }
        }
    }

    return winner;
}

/*
  Simulate a game with playerA and playerB
  
  Return:

  1 . PlayerA win
  2 . PlayerB win
  3 . Draw
*/
=======
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
>>>>>>> 0dce097f221d942062280e57a0bb9e6db1047bf4

function outcome(playerA, playerB) {
    var table = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    var pos_A = 0;
    var pos_B = 0;

<<<<<<< HEAD
    function convert(x) {
        return [Math.floor(x / 3)][x % 3];
    }

    for (var i = 0; i < 9; i++) {
        var pa = null;

        while (true) {
            pa = convert(playerA[pos_A++]);

            if (table[pa[0]][pa[1]] == 0) {
                break;
            }
        }        
        if (hasWinner(table)) {
            return 1;
        }
        var pb = null;
        
        while (true) {
            pb = convert(playerB[pos_B++]);

            if (table[pb[0]][pb[1]] == 0) {
                break;
            }
        }        
        
        if (hasWinner(table)) {
            return 2;
        }
    }
    
    return 0;
=======
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
>>>>>>> 0dce097f221d942062280e57a0bb9e6db1047bf4
}


/*
<<<<<<< HEAD
  Return array where [i, fitness] is the fitness of player i. Array is sorted by fitness
*/

function getFitness() {
    var fitness = [];

    for (var i = 0; i < MAX_PLAYERS; i++) {
        var curr = 0;

        for (var j = 0; j < MAX_PLAYERS; j++) {
            if (i != j) {
                curr += outcome(players[i], players[j]); // Player i plays first
                curr += outcome(players[j], players[i]); // Player j plays first
            }
        }
        
        fitness.push([i, curr]);
    }

    fitness.sort(function(a, b) {
        return a[1] - b[1];
    });
    
    return fitness;
}

function geneticAlgorithm() {
    for (var x = 0; x < 20; x++) {
        var fitness = getFitness();
        
        
    }
}

/*
  Initialize 50 initial players.
*/

function initialize_population() {
    for (var i = 0; i < MAX_PLAYERS; i++) {
        var curr = (function (array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }([0, 1, 2, 3, 4, 5, 6, 7, 8]));
        
        players.push(curr);
    }
}

initialize_population();
geneticAlgorithm();
=======
  Initialize data with all possible plays by players
*/

function initialization() {
    generatePlayers(0, []);
}

>>>>>>> 0dce097f221d942062280e57a0bb9e6db1047bf4
