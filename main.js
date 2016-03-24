/*
  A Genetic Approch to create an optimal 3x3 Tic Tac Toe Player
  The algorithm consists of simulating an evolutive process of position choices in the board.
  Beginning with 50 randomly generated players, it keeps improving newer players based on best players from previous generations.
*/

var MAX_PLAYERS = 60;
var BOARD_SIDE_LEN = 3;
var MAX_OFFSPRING_PARENTS = 6;

/*
  Simple array shuffle function as JS doesn't has it by default
*/
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


var Population = function() {
    this.players = [];
    this.initialize_population();
};

/*
 * Initialize MAX_PLAYERS initial players.
 */
Population.prototype.initialize_population = function() {
    this.players = [];

    var i;
    var base_player = [];

    for (i = 0; i < BOARD_SIDE_LEN * BOARD_SIDE_LEN; i++) {
        base_player.push(i);
    }    
    
    for (i = 0; i < MAX_PLAYERS; i++) {
        var curr = shuffle(base_player.slice());
        this.players.push(curr);
    }    
};


/*
 * Return array where [i, fitness] is the fitness of player i. Array is sorted by fitness
 */

Population.prototype.getFitness = function() {
    var fitness = [];

    var i, j;
    
    for (i = 0; i < MAX_PLAYERS; i++) {
        var curr = 0;
        for (j = 0; j < MAX_PLAYERS; j++) {
            if (i != j) {
                curr += new Game(this.players[i], this.players[j]).outcome(); // Player i plays first
                curr += new Game(this.players[j], this.players[i]).outcome(); // Player j plays first
            }
        }

        fitness.push([i, curr]);
    }
    
    fitness.sort(function(a, b) {
        return a[1] - b[1];
    });

    return fitness;
};

/*
 * As crossover process is still ambigious ('how to optimally merge two plays for a tic tac toe game'), it just shuffles player's order of play. It's basically crossover/mutation process in the same time.
 */
Population.prototype.evolve = function() {
    var fitness = this.getFitness(this.players);

    var new_players = [];

    var i, j, k, l;

    var median = 0;

    for (i = 0; i < MAX_PLAYERS; i++) {
        median += fitness[i][1];
    }

    //Crossover process
    for (i = 0; i < MAX_OFFSPRING_PARENTS; i++) {
        var crossovered_parent = this.players[fitness[i][0]];
        
        for (j = 0; j < MAX_OFFSPRING_PARENTS; j++) {
            if (Math.floor(Math.random() * 10) % 4 === 0) {
                new_players.push(this.players[Math.floor(Math.random() * (MAX_PLAYERS - 1))]);
            } else {
                crossovered_parent = shuffle(crossovered_parent);
                
                new_players.push(crossovered_parent.slice());
            }
        }    
    }

    for (i = 0; i < MAX_PLAYERS && new_players.length < MAX_PLAYERS; i++) {
        new_players.push(this.players[fitness[i][0]]);
    }

    this.players = new_players;
};




var Game = function(playerA, playerB) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.board   = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
};

/*
 * Checking whether we already have to 
 */

Game.prototype.hasWinner = function(board) {
    var winner = 0;
    
    var ver_cnt = [[0, 0], [0, 0], [0, 0]];
    var hor_cnt = [[0, 0], [0, 0], [0, 0]];

    var i, j;

    for (i = 0; i < BOARD_SIDE_LEN; i++) {
        for (j = 0; j < BOARD_SIDE_LEN; j++) {
            ver_cnt[j][board[i][j]] += 1;
            hor_cnt[i][board[i][j]] += 1;
        }
    }

    for (i = 0; i < BOARD_SIDE_LEN; i++) {
        for (j = 1; j <= 2; j++) {
            if (ver_cnt[i][j] == BOARD_SIDE_LEN) {
                winner = j;
            }
        }
    }

    if (board[1][1] !== 0 &&
        (board[1][1] == board[0][0] && board[1][1] == board[2][2]) ||
        (board[1][1] == board[0][2] && board[1][1] == board[2][0])) {

        winner = board[1][1];
    }

    return winner;
};

/*
  Simulate a game with playerA and playerB. playerA plays first

  Return:
  2 . PlayerA win
  0 . PlayerB win
  1 . Draw
*/

Game.prototype.simulate = function() {
    var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    var pos_A = 0;
    var pos_B = 0;

    function convert(x) {
        return [Math.floor(x / 3), x % 3];
    }

    var i;
    
    for (i = 0; i < 9; i++) {
        while (pos_A < BOARD_SIDE_LEN * BOARD_SIDE_LEN) {
            var pa = convert(this.playerA[pos_A++]);

            if (board[pa[0]][pa[1]] === 0) {
                board[pa[0]][pa[1]] = 1;
                break;
            }
        }
        if (this.hasWinner(board)) {
            return 2;
        }

        while (pos_B < BOARD_SIDE_LEN * BOARD_SIDE_LEN) {
            var pb = convert(this.playerB[pos_B++]);

            if (board[pb[0]][pb[1]] === 0) {
                board[pb[0]][pb[1]] = 2;
                break;
            }
        }

        if (this.hasWinner(board)) {
            return 0;
        }
    }
    
    return 1;
};


///////////////////////////////////////////////////////

var game = new Game();

function clearButtons() {
    for (var i = 0; i < 9; i++) {
        var button = document.getElementById(i.toString());

        button.checked = false;
    }    
}

function isClear() {
    for (var i = 0; i < 9; i++) {
        var button = document.getElementById(i.toString());

        if (button.checked) {
            return false;
        }
    }
    return true;
}

function loadButtons() {
    say = function(button) {
        console.log('hi');
    };
    
    for (var i = 0; i < 9; i++) {
        var button = document.getElementById(i.toString());

        button.onclick = say(button);
    }

    document.getElementById('reset').onclick = function() {
        clearButtons();
    };
}

loadButtons();
