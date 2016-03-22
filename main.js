/*
  A Genetic Approch to create an optimal 3x3 Tic Tac Toe Player
  The algorithm consists of simulating an evolutive process of position choices in the board.
  Beginning with 50 randomly generated players, it keeps improving newer players based on best players from previous generations.
*/

var MAX_PLAYERS = 50
var BOARD_SIDE_LEN = 3;
var MAX_OFFSPRING_PARENTS = 9;

var players = [];

/*
  Check whether a board has a winner. As win state is run after each play, if there's a winner, it will be only one.
  0. No winner at all
  1. Player 1 wins
  2. Player 2 wins
 */

function hasWinner(board) {
    var winner = 0;

    var ver_cnt = [[0, 0], [0, 0], [0, 0]];
    var hor_cnt = [[0, 0], [0, 0], [0, 0]];

    for (var i = 0; i < BOARD_SIDE_LEN; i++) {
        for (var j = 0; j < BOARD_SIDE_LEN; j++) {
            ver_cnt[j][board[i][j]] += 1;
            hor_cnt[i][board[i][j]] += 1;
        }
    }

    for (var i = 0; i < BOARD_SIDE_LEN; i++) {
        for (var j = 1; j <= 2; j++) {
            if (ver_cnt[i][j] == BOARD_SIDE_LEN) {
                winner = j;
            }
        }
    }

    if (board[1][1] != 0 &&
        board[1][1] == board[0][0] &&
        board[1][1] == board[2][2]) {

        winner = board[1][1];
    }

    if (board[1][1] != 0 &&
        board[1][1] == board[0][2] &&
        board[1][1] == board[2][0]) {

        winner = board[1][1];
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

function outcome(playerA, playerB) {
    var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    var pos_A = 0;
    var pos_B = 0;

    function convert(x) {
        return [Math.floor(x / 3), x % 3];
    }

    for (var i = 0; i < 9; i++) {
        var pa = null;

        while (pos_A < BOARD_SIDE_LEN * BOARD_SIDE_LEN) {
            pa = convert(playerA[pos_A++]);

            if (board[pa[0]][pa[1]] == 0) {
                board[pa[0]][pa[1]] = 1;
                break;
            }
        }

        if (hasWinner(board)) {
            return 1;
        }
        var pb = null;

        while (pos_B < BOARD_SIDE_LEN * BOARD_SIDE_LEN) {
            pb = convert(playerB[pos_B++]);

            if (board[pb[0]][pb[1]] == 0) {
                board[pb[0]][pb[1]] = 2;
                break;
            }
        }

        if (hasWinner(board)) {
            return 2;
        }
    }

    return 0;
}


/*
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

/*
  
*/

function geneticAlgorithm() {
    var fitness = getFitness();
    
    var new_players = [];
    
    //Crossover process
    for (var i = 0; i < MAX_OFFSPRING_PARENTS; i++) {
        for (var j = 0; j < MAX_OFFSPRING_PARENTS; j++) {
            if (i != j) {
                var crossovered_parent = players[fitness[i][0]];
                
                for (var k = 0; k < BOARD_SIDE_LEN * BOARD_SIDE_LEN; k++) {
                    if (Math.floor((Math.random() * 10)) % 2 == 0) {
                        crossovered_parent[k] = players[fitness[j][0]][k];
                    }
                }
                
                new_players.push(crossovered_parent);
            }
        }
    }

    //After the crossover and mutation process, there's only 45 new players, include 5 best players from the old population to the new one.

    for (var i = 0; i < 5; i++) {
        new_players.push(players[fitness[i][0]]);
    }

    //Mutation

    for (var i = 0; i < MAX_PLAYERS; i++) {
        for (var cnt_mutation = 0; cnt_mutation < 4; cnt_mutation) {
            //Mutation occurs with low probability of 1/10
            if (Math.floor(Math.random() * 10) == 3) {
                var pa = Math.floor(Math.random() * 10);
                var pb = Math.floor(Math.random() * 10);

                var tmp = new_players[i][pa];
                new_players[i][pa] = new_players[i][pb];
                new_players[i][pb] = tmp;                
            }
        }
    }
    
    players = new_players;
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
